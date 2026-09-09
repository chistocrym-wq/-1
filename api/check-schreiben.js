const MODEL = 'gpt-5';

const RESPONSE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['transcription','normalizedText','points','communicativeDesign','corrections','feedback'],
  properties: {
    transcription: { type: 'string' },
    normalizedText: { type: 'string' },
    points: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['point','score','max','covered','evidence'],
        properties: {
          point: { type: 'string' }, score: { type: 'number' }, max: { type: 'number' },
          covered: { type: 'boolean' }, evidence: { type: 'string' }
        }
      }
    },
    communicativeDesign: { type: 'number' },
    corrections: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['original','corrected','explanation'],
        properties: { original: { type: 'string' }, corrected: { type: 'string' }, explanation: { type: 'string' } }
      }
    },
    feedback: { type: 'string' }
  }
};

const SYSTEM_PROMPT = `You are Otto, the friendly German A1 writing trainer. Check the learner's answer against the supplied task only.

SCORING:
- Each required content point is exactly 3, 1.5 or 0 points.
- Communicative design (greeting, closing, understandable organization) is exactly 1, 0.5 or 0.
- Final trainer score = earned points / maximum points * 100.
- Grammar, articles, cases, endings, word order, verb forms and spelling NEVER reduce a content-point score when the intended meaning is understandable and the task point is fulfilled.
- Only reduce a content point when the requested information is missing, genuinely unclear or meaning is changed.
- The answer must contain at least 30 words in this trainer.

A1 LANGUAGE:
- Accept natural simple A1 German. Do not demand B1/B2 vocabulary or grammar.
- Exact model wording is NOT required. Equivalent natural A1 expressions are correct.
- For a language error, explain it briefly but do not present it as a lost content point when meaning is clear.

CORRECTIONS — VERY IMPORTANT:
- Return ONLY things that actually need changing or adding.
- Never list correct sentences, correct phrases, completed points or generic praise as corrections.
- Maximum 6 corrections. Keep every correction short.
- For a language correction: original = learner wording, corrected = natural German A1 wording, explanation = short Russian explanation.
- For a missing task point: original = "Не выполнено", corrected = a short German A1 phrase that would fulfill the point, explanation = Russian explanation of what must be added.
- Every correction must contain a useful German phrase/turn of phrase in corrected and a clear Russian explanation.
- Do not invent errors.

FEEDBACK — VERY IMPORTANT:
- Be concise, warm and friendly, like Otto helping a learner.
- Start with a short German assessment, then Russian assessment.
- Include one useful German A1 phrase/turn of phrase and its Russian meaning when there is something to improve.
- Finish with one short encouraging sentence in Russian.
- Do not repeat the whole learner text.
- Do not praise every correct part.
- Target about 2–5 short sentences total.

IMAGE:
- If an image is supplied, first transcribe the handwritten German. Never invent unreadable text; use [unleserlich].

Return only the supplied structured JSON.`;

function send(res, status, data) {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

function outputText(data) {
  if (typeof data.output_text === 'string' && data.output_text.trim()) return data.output_text;
  return (data.output || [])
    .flatMap(item => Array.isArray(item.content) ? item.content : [])
    .filter(item => item.type === 'output_text' && typeof item.text === 'string')
    .map(item => item.text).join('\n');
}

function parseJson(text) {
  const cleaned = String(text).trim().replace(/^```json\s*/i,'').replace(/^```\s*/i,'').replace(/\s*```$/i,'').trim();
  try { return JSON.parse(cleaned); }
  catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('OpenAI returned invalid JSON.');
    return JSON.parse(match[0]);
  }
}

function half(value, max) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(Math.max(0, Math.min(max, n)) * 2) / 2 : 0;
}

function countWords(value) {
  const s = String(value || '').trim();
  return s ? s.split(/\s+/).filter(Boolean).length : 0;
}

function sanitize(result, sourcePoints) {
  const aiPoints = Array.isArray(result?.points) ? result.points : [];
  const points = sourcePoints.map((point, index) => {
    const item = aiPoints[index] || {};
    const score = half(item.score, 3);
    return {
      point: String(point), score, max: 3, covered: score > 0,
      evidence: typeof item.evidence === 'string' ? item.evidence : ''
    };
  });

  const design = half(result?.communicativeDesign, 1);
  const maximum = points.length * 3 + 1;
  const earned = points.reduce((sum, point) => sum + point.score, 0) + design;
  const score = maximum ? Math.round((earned / maximum) * 100) : 0;
  const normalizedText = typeof result?.normalizedText === 'string' ? result.normalizedText : '';
  const transcription = typeof result?.transcription === 'string' ? result.transcription : '';
  const countedText = normalizedText.trim() ? normalizedText : transcription;
  const wordCount = countWords(countedText);
  const enoughWords = wordCount >= 30;
  const corrections = Array.isArray(result?.corrections) ? result.corrections.slice(0, 6).filter(c => c && (c.original || c.corrected || c.explanation)) : [];
  let feedback = typeof result?.feedback === 'string' ? result.feedback.trim() : '';
  if (!feedback) feedback = score >= 60 ? 'Bewertung: Gut gemacht! / Оценка: задание выполнено хорошо. Так держать!' : 'Bewertung: Weiter üben. / Оценка: задание стоит немного доработать. Ты справишься!';
  if (!enoughWords) feedback += `\nВ ответе ${wordCount} слов — нужно минимум 30.`;

  return {
    transcription,
    normalizedText,
    score,
    trainerScore: score,
    goetheScore: earned,
    goetheMax: maximum,
    passed: score >= 60 && enoughWords,
    wordCount,
    points,
    corrections,
    feedback
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });
  if (!process.env.OPENAI_API_KEY) return send(res, 500, { error: 'OPENAI_API_KEY is not configured on the server. В Vercel ключ должен быть добавлен для того окружения, где открыт тренажёр.' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { task, points, text, image } = body;
    if (!task || !Array.isArray(points) || !points.length) return send(res, 400, { error: 'Task data is missing.' });
    if (!text && !image) return send(res, 400, { error: 'No answer text or image was provided.' });
    if (typeof text === 'string' && text.length > 10000) return send(res, 413, { error: 'Text is too long.' });
    if (typeof image === 'string' && image.length > 3000000) return send(res, 413, { error: 'Фото слишком большое. Загрузите более компактное фото.' });

    const taskText = [
      'TASK SITUATION:', String(task), '',
      'REQUIRED POINTS:', ...points.map((point, i) => `${i + 1}. ${String(point)}`),
      '', 'MINIMUM WORD COUNT: 30 words.', '', 'Evaluate the learner answer.'
    ].join('\n');
    const content = [{ type: 'input_text', text: taskText }];
    if (image) content.push({ type: 'input_image', image_url: image });
    else content.push({ type: 'input_text', text: `LEARNER ANSWER:\n${String(text)}` });

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: MODEL,
        store: false,
        reasoning: { effort: 'minimal' },
        input: [
          { role: 'system', content: [{ type: 'input_text', text: SYSTEM_PROMPT }] },
          { role: 'user', content }
        ],
        text: { format: { type: 'json_schema', name: 'a1_writing_evaluation', strict: true, schema: RESPONSE_SCHEMA } },
        max_output_tokens: 4000
      })
    });

    const data = await response.json();
    if (!response.ok) return send(res, response.status, { error: `OpenAI API: ${data?.error?.message || 'request failed'}` });
    if (data?.status === 'incomplete') return send(res, 502, { error: `OpenAI не завершил проверку (incomplete: ${data?.incomplete_details?.reason || 'unknown'}). Попробуйте ещё раз.` });
    if (data?.status === 'failed') return send(res, 502, { error: `OpenAI не завершил проверку: ${data?.error?.message || 'request failed'}` });
    if (Array.isArray(data?.output) && data.output.some(item => item.type === 'message' && item.content?.some(c => c.type === 'refusal'))) return send(res, 502, { error: 'OpenAI отказался выполнить проверку ответа.' });

    const output = outputText(data);
    if (!output) return send(res, 502, { error: 'OpenAI API вернул пустой ответ. Попробуйте ещё раз.' });
    return send(res, 200, sanitize(parseJson(output), points));
  } catch (error) {
    console.error('check-schreiben error', error);
    return send(res, 500, { error: error instanceof Error ? error.message : 'Ошибка проверки ответа.' });
  }
}