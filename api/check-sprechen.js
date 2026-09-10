const TRANSCRIBE_MODEL = 'gpt-4o-mini-transcribe';
const FALLBACK_TRANSCRIBE_MODEL = 'whisper-1';
const EVALUATION_MODEL = 'gpt-4o-mini';
const MAX_AUDIO_BASE64 = 4000000;
const MAX_DURATION_SECONDS = 90;

const RESPONSE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['contentScore', 'covered', 'missing', 'language', 'feedback'],
  properties: {
    contentScore: { type: 'number' },
    covered: { type: 'array', items: { type: 'string' } },
    missing: { type: 'array', items: { type: 'string' } },
    language: {
      type: 'object',
      additionalProperties: false,
      required: ['score', 'corrections'],
      properties: {
        score: { type: 'number' },
        corrections: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['original', 'corrected', 'explanation'],
            properties: {
              original: { type: 'string' },
              corrected: { type: 'string' },
              explanation: { type: 'string' }
            }
          }
        }
      }
    },
    feedback: { type: 'string' }
  }
};

const SYSTEM_PROMPT = `You are Otto, a friendly Goethe A1 speaking trainer.
Evaluate only the learner's spoken German transcript against the supplied task.

CONTENT:
- Check whether each required point is clearly communicated.
- Do not require exact model wording. Natural simple A1 German is accepted.
- Do not penalize a point if the grammar is imperfect but the intended information is understandable.
- contentScore is 0-100 and should mainly reflect task completion.

LANGUAGE:
- Give a language score from 0-100 for understandable A1 German.
- Accept normal A1 mistakes if communication remains clear.
- Return at most 4 real corrections.
- original must be copied exactly from the transcript. Never invent or paraphrase it.
- corrected must be a natural simple A1 version.
- explanation must be short, with the German grammar/phrase term when useful and a simple Russian explanation.

IMPORTANT:
- Do not claim that a pronunciation error is proven by the transcript alone.
- The separate speech-recognition confidence is only an orientation for clarity/pronunciation. Do not use it to invent linguistic corrections.
- Keep feedback short, friendly and encouraging. Start with German, then Russian.
- Return only structured JSON.`;

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
  if (confidence === null) return { level: 'unknown', title: 'Проверка понятности недоступна', note: 'Текст распознан, но дополнительный показатель уверенности не вернулся.' };
  if (confidence >= 72) return { level: 'good', title: 'Речь распознана уверенно', note: 'Хороший ориентир: слова в записи в основном распознаются уверенно.' };
  if (confidence >= 50) return { level: 'attention', title: 'Есть слова для повторения', note: 'Некоторые фрагменты распознаны неуверенно. Попробуйте говорить чуть медленнее и чётче.' };
  return { level: 'low', title: 'Понятность стоит потренировать', note: 'Распознавание было неуверенным. Повторите ответ в тихом месте, чуть медленнее и чётче.' };
}

function buildTranscriptionForm(audioBuffer, safeMime, extension, model, includeLogprobs = false) {
  const form = new FormData();
  form.append('file', new Blob([audioBuffer], { type: safeMime }), `sprechen.${extension}`);
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

    // MediaRecorder on Android/Chrome commonly produces WebM/Opus. The new
    // transcription models are stricter about some WebM files, so try the
    // cheap/current model first and transparently fall back to Whisper only
    // when the file is rejected. This keeps the normal path inexpensive while
    // preventing a valid browser recording from becoming a dead end.
    const safeMime = typeof mimeType === 'string' && mimeType.includes('/') ? mimeType.split(';')[0] : 'audio/webm';
    const extension = safeMime.includes('mp4') ? 'mp4' : safeMime.includes('mpeg') ? 'mp3' : safeMime.includes('wav') ? 'wav' : safeMime.includes('ogg') ? 'ogg' : 'webm';

    let transcriptionData;
    let transcriptionResponse;
    let confidence = null;

    ({ response: transcriptionResponse, data: transcriptionData } = await transcribe(
      buildTranscriptionForm(audioBuffer, safeMime, extension, TRANSCRIBE_MODEL, true)
    ));

    if (!transcriptionResponse.ok) {
      console.warn('Primary transcription failed, retrying with whisper-1:', transcriptionData?.error?.message);
      ({ response: transcriptionResponse, data: transcriptionData } = await transcribe(
        buildTranscriptionForm(audioBuffer, safeMime, extension, FALLBACK_TRANSCRIBE_MODEL, false)
      ));
    } else {
      confidence = confidenceFromLogprobs(transcriptionData?.logprobs);
    }

    if (!transcriptionResponse.ok) {
      return send(res, transcriptionResponse.status, { error: `OpenAI transcription: ${transcriptionData?.error?.message || 'request failed'}` });
    }

    const transcription = typeof transcriptionData?.text === 'string' ? transcriptionData.text.trim() : '';
    if (!transcription) return send(res, 422, { error: 'Речь не удалось распознать. Попробуйте записать ответ ещё раз, ближе к микрофону.' });

    const clarity = confidenceLabel(confidence);
    const taskText = [
      'TASK:', String(task),
      '', 'REQUIRED POINTS:', ...points.map((point, index) => `${index + 1}. ${String(point)}`),
      '', 'LEARNER TRANSCRIPT:', transcription
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
            name: 'a1_speaking_evaluation',
            strict: true,
            schema: RESPONSE_SCHEMA
          }
        },
        max_output_tokens: 1800
      })
    });
    const evaluationData = await evaluationResponse.json();
    if (!evaluationResponse.ok) return send(res, evaluationResponse.status, { error: `OpenAI evaluation: ${evaluationData?.error?.message || 'request failed'}` });
    if (evaluationData?.status === 'incomplete') return send(res, 502, { error: 'Otto не завершил проверку. Попробуйте ещё раз.' });

    const output = outputText(evaluationData);
    if (!output) return send(res, 502, { error: 'Otto вернул пустой результат. Попробуйте ещё раз.' });
    const result = parseJson(output);
    const contentScore = clamp(result?.contentScore, 0, 100);
    const languageScore = clamp(result?.language?.score, 0, 100);
    const overallScore = Math.round(contentScore * 0.7 + languageScore * 0.3);
    const corrections = Array.isArray(result?.language?.corrections) ? result.language.corrections.slice(0, 4) : [];

    return send(res, 200, {
      transcription,
      contentScore,
      languageScore,
      overallScore,
      covered: Array.isArray(result?.covered) ? result.covered : [],
      missing: Array.isArray(result?.missing) ? result.missing : [],
      corrections,
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
