const MODEL = process.env.OPENAI_MODEL || 'gpt-5-mini';

const SYSTEM_PROMPT = `You are the German writing evaluator for an original Goethe-Zertifikat A1 training app.
Evaluate ONLY the learner's supplied task and answer. Use A1 expectations. Never demand B1/B2 grammar or vocabulary.

AUTHORITATIVE SCHREIBEN A1 RULEBOOK:
- Main goal: complete, understandable task fulfillment, not elegant or advanced German.
- The task normally contains 3 required content points. Award points ONLY for the supplied required points. Never invent extra requirements.
- Each required content point receives exactly 3, 1.5, or 0 points: 3 = fully and appropriately addressed; 1.5 = partly/unclearly addressed; 0 = missing, wrong, or unrelated.
- Communicative design receives exactly 1, 0.5, or 0 for appropriate greeting/closing and understandable message organization.
- Personal letter: Lieber + male name / Liebe + female name; closing Viele Grüße + name.
- Formal letter: Sehr geehrte Damen und Herren / Sehr geehrter Herr ... / Sehr geehrte Frau ...; closing Mit freundlichen Grüßen + name.
- A comma follows the greeting.
- A short closing sentence such as Ich freue mich auf deine/Ihre Antwort is recommended, but it is NOT an additional content point unless the supplied task explicitly requires it.
- Aim for about 30 words. Do not punish a slightly shorter or longer answer when the task is complete and understandable.
- Prefer short, clear A1 sentences. Natural A1 wording is accepted; exact model wording is never required.

CRITICAL SCORING RULE ABOUT LANGUAGE ERRORS:
- Grammar errors, article errors, case/ending errors, word-order errors, wrong verb forms, vocabulary-form errors and spelling errors are NOT score deductions in this trainer when the intended content is understandable and the required point is fulfilled.
- In particular, DO NOT reduce content-point scores merely because the learner used the wrong article (der/die/das/ein/eine/einen etc.) or made a grammar mistake.
- Explain such errors for learning purposes, but explicitly state in Russian that this is a language error to correct, NOT an error that reduces the score in this training when meaning remains clear.
- Use wording such as: "Это языковая ошибка, но в этой тренировке она не снижает баллы, если смысл понятен и пункт задания выполнен. Для экзамена слово/форма должны быть написаны правильно." 
- Only language can affect a content point if the error makes the requested information genuinely unclear, changes its meaning, or means the required point was not actually communicated.
- Do NOT use diagnostic grammar/vocabulary/spelling scores to calculate the final score.
- The final score MUST use ONLY the required content-point scores plus communicativeDesign: sum(points.score) + communicativeDesign.score, divided by sum(points.max) + communicativeDesign.max, multiplied by 100 and rounded.
- The result is a trainer score, not an official Goethe certificate score.

A1 LANGUAGE REFERENCE FROM THE TRAINER MATERIAL:
- Affirmative sentence: subject + verb + rest; verb normally in second position.
- W-question: question word + verb + subject + rest.
- Yes/no question: verb + subject + rest.
- Basic Präsens, sein/haben, personal pronouns, können/wollen/müssen/mögen, nicht.
- Time prepositions: am for days/day of week, um for exact time, im for month/season.
- Useful phrases are examples, not mandatory wording: Vielen Dank für die Einladung; Ich komme gern; Ich kann leider nicht kommen; Wann beginnt der Kurs?; Wie viel kostet der Kurs?; Können Sie mir Informationen schicken?; Ich freue mich auf Ihre Antwort; Vielen Dank im Voraus; Mit freundlichen Grüßen; Bis bald.

FEEDBACK POLICY:
- Explain corrections in simple Russian.
- For meaningful language corrections use: "Было → Лучше → Почему → Как запомнить".
- Clearly distinguish "языковая ошибка" from "ошибка, за которую снимаются баллы".
- If an answer is understandable and a content point is fulfilled, give the content point credit even when grammar or articles are imperfect.
- Be supportive and A1-appropriate.
- If an image is supplied, transcribe the handwritten German first. Never invent unreadable text; use [unleserlich].

Return ONLY valid JSON with this shape:
{
  "transcription": "",
  "normalizedText": "",
  "goetheScore": 0,
  "goetheMax": 10,
  "trainerScore": 0,
  "passed": false,
  "wordCount": 0,
  "criteria": {
    "taskCompletion": {"score": 0, "max": 0, "comment": ""},
    "communicativeDesign": {"score": 0, "max": 1, "comment": ""},
    "communicativeSuccess": {"score": 0, "max": 20, "comment": ""},
    "grammar": {"score": 0, "max": 15, "comment": ""},
    "vocabulary": {"score": 0, "max": 10, "comment": ""},
    "spelling": {"score": 0, "max": 10, "comment": ""}
  },
  "points": [{"point": "", "score": 0, "max": 3, "covered": false, "evidence": ""}],
  "corrections": [{"original": "", "corrected": "", "explanation": ""}],
  "strengths": [""],
  "feedback": ""
}

For criteria other than task completion and communicativeDesign, use 0-20/15/10/10 ONLY as diagnostic information. They must NEVER change the final score.`;

function jsonResponse(res, status, data) {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

function extractOutputText(data) {
  if (typeof data.output_text === 'string') return data.output_text;
  const chunks = [];
  for (const item of data.output || []) {
    for (const part of item.content || []) {
      if (typeof part.text === 'string') chunks.push(part.text);
    }
  }
  return chunks.join('\n');
}

function parseJson(text) {
  const cleaned = text.trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  return JSON.parse(cleaned);
}

function clampHalf(value, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  const clamped = Math.max(0, Math.min(max, n));
  return Math.round(clamped * 2) / 2;
}

function sanitizeResult(result, points) {
  const sourcePoints = points.map(String);
  const aiPoints = Array.isArray(result?.points) ? result.points : [];
  const normalizedPoints = sourcePoints.map((point, index) => {
    const item = aiPoints[index] || {};
    const score = clampHalf(item.score, 3);
    return {
      point,
      score,
      max: 3,
      covered: score > 0,
      evidence: typeof item.evidence === 'string' ? item.evidence : '',
    };
  });

  const designScore = clampHalf(result?.criteria?.communicativeDesign?.score, 1);
  const rawMax = normalizedPoints.length * 3 + 1;
  const rawScore = normalizedPoints.reduce((sum, item) => sum + item.score, 0) + designScore;
  const trainerScore = rawMax ? Math.round((rawScore / rawMax) * 100) : 0;

  const wordCount = Number.isFinite(Number(result?.wordCount))
    ? Math.max(0, Math.round(Number(result.wordCount)))
    : 0;

  const criteria = result?.criteria || {};
  const diagnostic = (name, max) => ({
    score: Math.max(0, Math.min(max, Number(criteria[name]?.score) || 0)),
    max,
    comment: typeof criteria[name]?.comment === 'string' ? criteria[name].comment : '',
  });

  return {
    transcription: typeof result?.transcription === 'string' ? result.transcription : '',
    normalizedText: typeof result?.normalizedText === 'string' ? result.normalizedText : '',
    score: trainerScore,
    trainerScore,
    goetheScore: rawScore,
    goetheMax: rawMax,
    passed: trainerScore >= 60,
    wordCount,
    criteria: {
      taskCompletion: {
        score: normalizedPoints.reduce((sum, item) => sum + item.score, 0),
        max: normalizedPoints.length * 3,
        comment: typeof criteria.taskCompletion?.comment === 'string' ? criteria.taskCompletion.comment : '',
      },
      format: {
        score: designScore,
        max: 1,
        comment: typeof criteria.communicativeDesign?.comment === 'string' ? criteria.communicativeDesign.comment : '',
      },
      communicativeSuccess: diagnostic('communicativeSuccess', 20),
      grammar: diagnostic('grammar', 15),
      vocabulary: diagnostic('vocabulary', 10),
      spelling: diagnostic('spelling', 10),
    },
    points: normalizedPoints,
    corrections: Array.isArray(result?.corrections) ? result.corrections.slice(0, 12) : [],
    strengths: Array.isArray(result?.strengths) ? result.strengths.slice(0, 8) : [],
    feedback: typeof result?.feedback === 'string' ? result.feedback : '',
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return jsonResponse(res, 405, { error: 'Method not allowed' });
  if (!process.env.OPENAI_API_KEY) {
    return jsonResponse(res, 500, { error: 'OPENAI_API_KEY is not configured on the server.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { task, points, minWords = 25, maxWords = 35, text, image } = body;

    if (!task || !Array.isArray(points) || points.length === 0) {
      return jsonResponse(res, 400, { error: 'Task data is missing.' });
    }
    if (!text && !image) return jsonResponse(res, 400, { error: 'No answer text or image was provided.' });
    if (typeof text === 'string' && text.length > 10000) return jsonResponse(res, 413, { error: 'Text is too long.' });
    if (typeof image === 'string' && image.length > 3000000) {
      return jsonResponse(res, 413, { error: 'Image is too large. Please upload a smaller photo.' });
    }

    const taskText = [
      'TASK SITUATION:', String(task),
      '', 'REQUIRED POINTS:',
      ...points.map((p, i) => `${i + 1}. ${String(p)}`),
      '', `TARGET WORD COUNT: approximately ${minWords}-${maxWords} words.`,
      '', 'Evaluate the learner answer and return JSON only.'
    ].join('\n');

    const userContent = [{ type: 'input_text', text: taskText }];
    if (image) {
      userContent.push({ type: 'input_image', image_url: image });
    } else {
      userContent.push({ type: 'input_text', text: `LEARNER ANSWER:\n${String(text)}` });
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        store: false,
        input: [
          { role: 'system', content: [{ type: 'input_text', text: SYSTEM_PROMPT }] },
          { role: 'user', content: userContent },
        ],
        max_output_tokens: 2200,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return jsonResponse(res, response.status, { error: data?.error?.message || 'OpenAI request failed.' });
    }

    const output = extractOutputText(data);
    const result = parseJson(output);
    return jsonResponse(res, 200, sanitizeResult(result, points));
  } catch (error) {
    console.error('check-schreiben error', error);
    return jsonResponse(res, 500, { error: 'Die KI-Prüfung konnte nicht durchgeführt werden.' });
  }
}
