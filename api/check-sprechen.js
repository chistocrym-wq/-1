const TRANSCRIBE_MODEL = 'gpt-4o-mini-transcribe';
const FALLBACK_TRANSCRIBE_MODEL = 'whisper-1';
const EVALUATION_MODEL = 'gpt-4o-mini';
const MAX_AUDIO_BASE64 = 4000000;
const MAX_DURATION_SECONDS = 90;

const RESPONSE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['pointResults', 'feedback'],
  properties: {
    pointResults: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['point', 'status', 'evidence'],
        properties: {
          point: { type: 'string' },
          status: { type: 'string', enum: ['full', 'partial', 'missing'] },
          evidence: { type: 'string' }
        }
      }
    },
    feedback: { type: 'string' }
  }
};

const SYSTEM_PROMPT = `You are Otto, a Goethe A1 SPEAKING trainer.
Your job is to check whether the learner actually said all required information aloud.

THIS IS SPEAKING, NOT WRITING.
- The transcript is only a technical transcription of spoken audio.
- NEVER judge spelling, capitalization, punctuation, written endings or written word forms.
- NEVER return spelling corrections.
- Do not give a language/grammar score.
- Do not invent pronunciation mistakes from the transcript.

TASK COVERAGE:
- Check EVERY required point separately, one by one.
- A point is FULL only when the learner clearly said the required information.
- PARTIAL when the learner gave related information but the required point is incomplete or unclear.
- MISSING when the learner did not say the required information.
- Natural A1 wording is accepted. Exact template wording is NOT required.
- Do not require extra information that is not in the required points.
- evidence must be a very short description in Russian of what was actually heard that supports the status. Do not quote or correct spelling.

IMPORTANT FOR THE INTRODUCTION TASK:
The points may be labels such as Name?, Alter?, Land?, Wohnort?, Schule?, Sprachen?, Hobby?.
Interpret each label semantically: the learner must say the corresponding personal information aloud.

FEEDBACK:
- Mention the number of completed points and the missing/partial points.
- Start with a short German sentence, then Russian.
- Keep it encouraging and concise.
- Do not discuss spelling or written German.
- Do not claim a precise phonetic pronunciation score; pronunciation/clarity is estimated separately from speech-recognition confidence.

Return only structured JSON.`;

function send(res, status, data) {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

function outputText(data) {
  if (typeof data.output_text === 'string' && data.output_text.trim()) return data.output_text;
  return (data.output || [])
    .flatMap((item) => Array.isArray(item.content) ? item.content : [])
    .filter((item) => item.type === 'output_text' && typeof item.text === 'string')
    .map((item) => item.text)
    .join('\n');
}

function parseJson(text) {
  const cleaned = String(text).trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  try { return JSON.parse(cleaned); } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('OpenAI returned invalid JSON.');
    return JSON.parse(match[0]);
  }
}

function clamp(value, min, max) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(Math.max(min, Math.min(max, n))) : min;
}

function confidenceFromLogprobs(logprobs) {
  if (!Array.isArray(logprobs) || !logprobs.length) return null;
  const values = logprobs
    .map((item) => Number(item?.logprob))
    .filter((value) => Number.isFinite(value));
  if (!values.length) return null;
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.round(Math.max(0, Math.min(100, Math.exp(avg) * 100)));
}

function confidenceLabel(confidence) {
  if (confidence === null) return {
    level: 'unknown',
    title: 'Понятность речи не удалось оценить отдельно',
    note: 'Речь распознана, но отдельного сигнала для оценки понятности нет.'
  };
  if (confidence >= 82) return {
    level: 'good',
    title: 'Речь распознаётся уверенно',
    note: 'Слова в записи в основном распознаются уверенно. Это ориентир по понятности записи, а не оценка орфографии.'
  };
  if (confidence >= 62) return {
    level: 'attention',
    title: 'Есть фрагменты, которые распознаются неуверенно',
    note: 'Попробуйте говорить чуть медленнее, чётче и ближе к микрофону. Это не проверка написания слов.'
  };
  return {
    level: 'low',
    title: 'Понятность речи стоит потренировать',
    note: 'Распознавание было неуверенным. Повторите ответ в тихом месте, чуть медленнее и чётче.'
  };
}

function detectAudioContainer(buffer, suppliedMime) {
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WAVE') return { mime: 'audio/wav', extension: 'wav' };
  if (buffer.length >= 4 && buffer.toString('ascii', 0, 4) === 'OggS') return { mime: 'audio/ogg', extension: 'ogg' };
  if (buffer.length >= 4 && buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) return { mime: 'audio/webm', extension: 'webm' };
  if (buffer.length >= 8 && buffer.toString('ascii', 4, 8) === 'ftyp') return { mime: suppliedMime?.includes('m4a') ? 'audio/m4a' : 'audio/mp4', extension: suppliedMime?.includes('m4a') ? 'm4a' : 'mp4' };
  if (buffer.length >= 3 && buffer.toString('ascii', 0, 3) === 'ID3') return { mime: 'audio/mpeg', extension: 'mp3' };
  const mime = typeof suppliedMime === 'string' && suppliedMime.includes('/') ? suppliedMime.split(';')[0] : 'audio/webm';
  const extension = mime.includes('mp4') ? 'mp4' : mime.includes('mpeg') || mime.includes('mpga') ? 'mp3' : mime.includes('wav') ? 'wav' : mime.includes('m4a') ? 'm4a' : mime.includes('ogg') ? 'ogg' : 'webm';
  return { mime, extension };
}

function buildTranscriptionForm(audioBuffer, container, model, includeLogprobs = false) {
  const form = new FormData();
  const file = new File([audioBuffer], `sprechen.${container.extension}`, { type: container.mime });
  form.append('file', file);
  form.append('model', model);
  form.append('language', 'de');
  form.append('response_format', 'json');
  if (includeLogprobs) form.append('include[]', 'logprobs');
  return form;
}

async function transcribe(form) {
  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: form
  });
  const data = await response.json();
  return { response, data };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });
  if (!process.env.OPENAI_API_KEY) return send(res, 500, { error: 'OPENAI_API_KEY is not configured on the server.' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { task, points, audioBase64, mimeType, duration } = body;

    if (!task || !Array.isArray(points) || !points.length) return send(res, 400, { error: 'Task data is missing.' });
    if (typeof audioBase64 !== 'string' || !audioBase64) return send(res, 400, { error: 'No audio was provided.' });
    if (audioBase64.length > MAX_AUDIO_BASE64) return send(res, 413, { error: 'Запись слишком большая. Сделайте ответ короче.' });
    if (Number(duration) > MAX_DURATION_SECONDS) return send(res, 400, { error: `Максимальная длина ответа — ${MAX_DURATION_SECONDS} секунд.` });

    const rawBase64 = audioBase64.replace(/^data:[^;]+;base64,/, '');
    const audioBuffer = Buffer.from(rawBase64, 'base64');
    if (!audioBuffer.length) return send(res, 400, { error: 'Audio data is empty.' });

    const container = detectAudioContainer(audioBuffer, mimeType);
    let transcriptionData;
    let transcriptionResponse;
    let confidence = null;

    ({ response: transcriptionResponse, data: transcriptionData } = await transcribe(
      buildTranscriptionForm(audioBuffer, container, TRANSCRIBE_MODEL, true)
    ));

    if (transcriptionResponse.ok) {
      confidence = confidenceFromLogprobs(transcriptionData?.logprobs);
    } else {
      console.warn('gpt-4o-mini-transcribe failed, retrying with whisper-1:', transcriptionData?.error?.message);
      ({ response: transcriptionResponse, data: transcriptionData } = await transcribe(
        buildTranscriptionForm(audioBuffer, container, FALLBACK_TRANSCRIBE_MODEL, false)
      ));
    }

    if (!transcriptionResponse.ok) {
      return send(res, transcriptionResponse.status, { error: `OpenAI transcription: ${transcriptionData?.error?.message || 'request failed'}` });
    }

    const transcription = typeof transcriptionData?.text === 'string' ? transcriptionData.text.trim() : '';
    if (!transcription) return send(res, 422, { error: 'Речь не удалось распознать. Попробуйте записать ответ ещё раз, ближе к микрофону.' });

    const taskText = [
      'TASK:', String(task),
      '', 'REQUIRED POINTS:', ...points.map((point, index) => `${index + 1}. ${String(point)}`),
      '', 'LEARNER SPOKEN TRANSCRIPT (technical transcription of speech; do not treat it as written text):', transcription
    ].join('\n');

    const evaluationResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: EVALUATION_MODEL,
        store: false,
        input: [
          { role: 'system', content: [{ type: 'input_text', text: SYSTEM_PROMPT }] },
          { role: 'user', content: [{ type: 'input_text', text: taskText }] }
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'a1_speaking_task_coverage',
            strict: true,
            schema: RESPONSE_SCHEMA
          }
        },
        max_output_tokens: 1600
      })
    });
    const evaluationData = await evaluationResponse.json();
    if (!evaluationResponse.ok) return send(res, evaluationResponse.status, { error: `OpenAI evaluation: ${evaluationData?.error?.message || 'request failed'}` });
    if (evaluationData?.status === 'incomplete') return send(res, 502, { error: 'Otto не завершил проверку. Попробуйте ещё раз.' });

    const output = outputText(evaluationData);
    if (!output) return send(res, 502, { error: 'Otto вернул пустой результат. Попробуйте ещё раз.' });
    const result = parseJson(output);

    const pointResults = points.map((point, index) => {
      const found = Array.isArray(result?.pointResults)
        ? result.pointResults.find((item) => String(item?.point || '').trim().toLowerCase() === String(point).trim().toLowerCase())
          || result.pointResults[index]
        : null;
      const status = ['full', 'partial', 'missing'].includes(found?.status) ? found.status : 'missing';
      return {
        point: String(point),
        status,
        evidence: typeof found?.evidence === 'string' ? found.evidence : ''
      };
    });

    const earnedUnits = pointResults.reduce((sum, item) => sum + (item.status === 'full' ? 1 : item.status === 'partial' ? 0.5 : 0), 0);
    const contentScore = points.length ? Math.round((earnedUnits / points.length) * 100) : 0;
    const covered = pointResults.filter((item) => item.status === 'full').map((item) => item.point);
    const partial = pointResults.filter((item) => item.status === 'partial').map((item) => item.point);
    const missing = pointResults.filter((item) => item.status === 'missing').map((item) => item.point);
    const clarity = confidenceLabel(confidence);

    return send(res, 200, {
      transcription,
      contentScore,
      overallScore: contentScore,
      pointResults,
      covered,
      partial,
      missing,
      feedback: typeof result?.feedback === 'string' ? result.feedback : '',
      pronunciation: {
        confidence,
        level: clarity.level,
        title: clarity.title,
        note: clarity.note
      },
      duration: Number(duration) || null
    });
  } catch (error) {
    console.error('check-sprechen error', error);
    return send(res, 500, { error: error instanceof Error ? error.message : 'Ошибка проверки устного ответа.' });
  }
}
