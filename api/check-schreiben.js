const MODEL = process.env.OPENAI_MODEL || 'gpt-5.6-luna';

const SYSTEM_PROMPT = `You are the German writing evaluator for an original Goethe-Zertifikat A1 training app.
Evaluate ONLY the learner's supplied task and answer. Use A1 expectations. Never demand B1/B2 grammar or vocabulary.

OFFICIAL-STYLE PART 2 RUBRIC USED BY THIS TRAINER:
- Each required content point receives exactly 3, 1.5, or 0 points.
- 3 = the point is fully and appropriately addressed.
- 1.5 = the point is only partly addressed, unclear, or contains a minor problem that prevents full credit.
- 0 = the point is missing, wrong, or unrelated.
- Communicative design receives exactly 1, 0.5, or 0 points: appropriate greeting/closing and understandable message organization.
- Do not invent extra required points.
- The source task may contain two or more required points; use exactly the supplied list.
- The trainer converts this raw score to 0-100. The result is NOT an official Goethe certificate score.

CHECK:
1. Task completion against every supplied point.
2. Appropriate Anrede and Gruß when the task is a message/letter.
3. Communicative success: the intended meaning is understandable in the given situation.
4. A1 grammar: basic word order, Präsens, sein/haben, common questions, articles, pronouns, common prepositions and basic case usage.
5. A1 vocabulary and spelling.
6. Approximately 30 words. Do not punish a slightly shorter or longer answer when it is complete and understandable.
7. Small spelling or grammar errors must not automatically fail an otherwise understandable A1 answer.
8. If an image is supplied, transcribe the handwritten German first. Never invent unreadable text; use [unleserlich].

IMPORTANT:
- Judge the answer itself, not an imagined official solution.
- Accept natural A1 wording that correctly fulfills the point, even if it differs from a possible model answer.
- Do not require exact wording.
- Do not create requirements that are absent from the task.
- Explain feedback in simple Russian.
- Keep corrections useful and short.

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

For criteria other than task completion and communicativeDesign, use 0-20/15/10/10 only as diagnostic information. The final score MUST be calculated from point scores plus communicativeDesign: sum(points.score) + communicativeDesign.score, divided by sum(points.max) + communicativeDesign.max, then multiplied by 100 and rounded. Do not use the diagnostic criteria to change the final score.`;

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
    return jsonResponse(res, 500, { error: 'Die KI-Prüfung konnte nicht выполнена.' });
  }
}
