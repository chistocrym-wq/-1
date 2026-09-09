const MODEL = process.env.OPENAI_MODEL || 'gpt-5-mini';

const SYSTEM_PROMPT = `You are the German writing evaluator for an original Goethe-Zertifikat A1 training app. Evaluate only the supplied task and learner answer. Never demand B1/B2.

SCORING:
- Award points ONLY for the supplied required content points. Each point is exactly 3, 1.5, or 0.
- Communicative design is exactly 1, 0.5, or 0 for appropriate greeting/closing and understandable organization.
- Final trainer score = (sum content points + communicative design) / maximum * 100. Diagnostic grammar/vocabulary/spelling scores NEVER change the final score.
- Natural A1 wording is accepted; exact model wording is never required.

LANGUAGE-ERROR POLICY:
- Grammar, articles, cases/endings, word order, verb forms, vocabulary forms and spelling errors DO NOT reduce content-point scores when the meaning is understandable and the required point is fulfilled.
- Explain these errors for learning, but explicitly say in Russian: "Это языковая ошибка, но в этой тренировке она не снижает баллы, если смысл понятен и пункт задания выполнен. Для экзамена слово/форма должны быть написаны правильно."
- Only reduce a content point when the language error makes the requested information genuinely unclear, changes its meaning, or means the point was not communicated.

LETTER RULES:
- The answer must contain AT LEAST 30 words in this trainer. Count actual words. If fewer than 30, clearly report that the minimum was not reached and encourage adding relevant information.
- Prefer short, clear A1 sentences.
- Personal: Lieber/Liebe + name; Viele Grüße + name.
- Formal: Sehr geehrte Damen und Herren / Sehr geehrter Herr ... / Sehr geehrte Frau ...; Mit freundlichen Grüßen + name.
- Comma after greeting.
- A short closing sentence such as Ich freue mich auf deine/Ihre Antwort is recommended, but is not an extra content point unless the task requires it.
- A1 reference: basic Präsens, sein/haben, personal pronouns, können/wollen/müssen/mögen, nicht; W-questions and yes/no questions; am for days, um for exact time, im for month/season.
- Useful phrases are examples only, never mandatory wording.

FEEDBACK:
- Explain in simple Russian.
- For corrections use: Было → Лучше → Почему → Как запомнить.
- Clearly distinguish a language error from an error that costs points.
- If an image is supplied, transcribe handwritten German first; never invent unreadable text, use [unleserlich].

Return ONLY valid JSON: {"transcription":"","normalizedText":"","goetheScore":0,"goetheMax":10,"trainerScore":0,"passed":false,"wordCount":0,"criteria":{"taskCompletion":{"score":0,"max":0,"comment":""},"communicativeDesign":{"score":0,"max":1,"comment":""},"communicativeSuccess":{"score":0,"max":20,"comment":""},"grammar":{"score":0,"max":15,"comment":""},"vocabulary":{"score":0,"max":10,"comment":""},"spelling":{"score":0,"max":10,"comment":""}},"points":[{"point":"","score":0,"max":3,"covered":false,"evidence":""}],"corrections":[{"original":"","corrected":"","explanation":""}],"strengths":[""],"feedback":""}`;

function send(res, status, data) {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}
function outputText(data) {
  if (typeof data.output_text === 'string') return data.output_text;
  return (data.output || []).flatMap(x => x.content || []).map(x => x.text).filter(Boolean).join('\n');
}
function parseJson(text) {
  return JSON.parse(String(text).trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim());
}
function half(value, max) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(Math.max(0, Math.min(max, n)) * 2) / 2 : 0;
}
function countWords(value) {
  const s = String(value || '').trim();
  return s ? s.split(/\s+/).filter(Boolean).length : 0;
}
function sanitize(result, points) {
  const sourcePoints = points.map(String);
  const aiPoints = Array.isArray(result?.points) ? result.points : [];
  const normalizedPoints = sourcePoints.map((point, i) => {
    const item = aiPoints[i] || {};
    const score = half(item.score, 3);
    return { point, score, max: 3, covered: score > 0, evidence: typeof item.evidence === 'string' ? item.evidence : '' };
  });
  const design = half(result?.criteria?.communicativeDesign?.score, 1);
  const max = normalizedPoints.length * 3 + 1;
  const raw = normalizedPoints.reduce((sum, p) => sum + p.score, 0) + design;
  const score = max ? Math.round(raw / max * 100) : 0;
  const text = typeof result?.normalizedText === 'string' && result.normalizedText.trim() ? result.normalizedText : (result?.transcription || '');
  const wordCount = countWords(text);
  const enoughWords = wordCount >= 30;
  const c = result?.criteria || {};
  const diagnostic = (name, limit) => ({ score: Math.max(0, Math.min(limit, Number(c[name]?.score) || 0)), max: limit, comment: typeof c[name]?.comment === 'string' ? c[name].comment : '' });
  const feedback = typeof result?.feedback === 'string' ? result.feedback : '';
  return {
    transcription: typeof result?.transcription === 'string' ? result.transcription : '',
    normalizedText: typeof result?.normalizedText === 'string' ? result.normalizedText : '',
    score, trainerScore: score, goetheScore: raw, goetheMax: max,
    passed: score >= 60 && enoughWords,
    wordCount,
    criteria: {
      taskCompletion: { score: normalizedPoints.reduce((s, p) => s + p.score, 0), max: normalizedPoints.length * 3, comment: typeof c.taskCompletion?.comment === 'string' ? c.taskCompletion.comment : '' },
      format: { score: design, max: 1, comment: typeof c.communicativeDesign?.comment === 'string' ? c.communicativeDesign.comment : '' },
      communicativeSuccess: diagnostic('communicativeSuccess', 20),
      grammar: diagnostic('grammar', 15), vocabulary: diagnostic('vocabulary', 10), spelling: diagnostic('spelling', 10)
    },
    points: normalizedPoints,
    corrections: Array.isArray(result?.corrections) ? result.corrections.slice(0, 12) : [],
    strengths: Array.isArray(result?.strengths) ? result.strengths.slice(0, 8) : [],
    feedback: enoughWords ? feedback : `${feedback}${feedback ? ' ' : ''}В ответе ${wordCount} слов. Минимум для этой тренировки — 30 слов.`
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });
  if (!process.env.OPENAI_API_KEY) return send(res, 500, { error: 'OPENAI_API_KEY is not configured on the server.' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { task, points, minWords = 30, text, image } = body;
    if (!task || !Array.isArray(points) || !points.length) return send(res, 400, { error: 'Task data is missing.' });
    if (!text && !image) return send(res, 400, { error: 'No answer text or image was provided.' });
    if (typeof text === 'string' && text.length > 10000) return send(res, 413, { error: 'Text is too long.' });
    if (typeof image === 'string' && image.length > 3000000) return send(res, 413, { error: 'Image is too large. Please upload a smaller photo.' });
    const taskText = ['TASK SITUATION:', String(task), '', 'REQUIRED POINTS:', ...points.map((p, i) => `${i + 1}. ${String(p)}`), '', `MINIMUM WORD COUNT: ${minWords} words.`, '', 'Evaluate the learner answer and return JSON only.'].join('\n');
    const content = [{ type: 'input_text', text: taskText }];
    if (image) content.push({ type: 'input_image', image_url: image });
    else content.push({ type: 'input_text', text: `LEARNER ANSWER:\n${String(text)}` });
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: MODEL, store: false, input: [{ role: 'system', content: [{ type: 'input_text', text: SYSTEM_PROMPT }] }, { role: 'user', content }], max_output_tokens: 2200 })
    });
    const data = await response.json();
    if (!response.ok) return send(res, response.status, { error: data?.error?.message || 'OpenAI request failed.' });
    return send(res, 200, sanitize(parseJson(outputText(data)), points));
  } catch (error) {
    console.error('check-schreiben error', error);
    return send(res, 500, { error: 'Die KI-Prüfung konnte nicht durchgeführt werden.' });
  }
}
