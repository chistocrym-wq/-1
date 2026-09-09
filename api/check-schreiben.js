const MODEL = process.env.OPENAI_MODEL || 'gpt-5.6-luna';

const SYSTEM_PROMPT = `You are an expert Goethe-Zertifikat A1 German writing evaluator. Evaluate learner writing against the supplied task, using A1 expectations only. Do not demand B1/B2 grammar or vocabulary.

Check all of these:
1. Task completion: each required bullet point is addressed with relevant information.
2. Format: appropriate Anrede (greeting) and Gruß (closing) when the task asks for a message/letter.
3. Communicative success: the intended meaning is understandable and appropriate to the situation.
4. A1 grammar: basic word order, Präsens, sein/haben, questions, articles, pronouns, common prepositions and basic case usage where relevant.
5. A1 vocabulary and spelling.
6. Word count: around the requested 30 words. Do not punish a learner merely for being a little above/below; judge whether the answer is reasonably complete.
7. For an image, first transcribe the handwritten German as accurately as possible. If a word is genuinely unreadable, mark it with [unleserlich] rather than inventing it.

Important: A small spelling/grammar error should not make an otherwise understandable A1 answer fail. Explain errors simply in Russian. Do not invent task requirements. Do not compare the answer with an official Goethe solution.

Return ONLY valid JSON with this shape:
{
  "transcription": "string, empty for typed text",
  "normalizedText": "best readable German text",
  "score": 0,
  "passed": true,
  "wordCount": 0,
  "criteria": {
    "taskCompletion": {"score": 0, "max": 30, "comment": ""},
    "format": {"score": 0, "max": 15, "comment": ""},
    "communicativeSuccess": {"score": 0, "max": 20, "comment": ""},
    "grammar": {"score": 0, "max": 15, "comment": ""},
    "vocabulary": {"score": 0, "max": 10, "comment": ""},
    "spelling": {"score": 0, "max": 10, "comment": ""}
  },
  "points": [{"point": "", "covered": true, "evidence": ""}],
  "corrections": [{"original": "", "corrected": "", "explanation": ""}],
  "strengths": [""],
  "feedback": ""
}

Score is 0-100 and is a trainer score, not an official Goethe score. Set passed=true when the answer is sufficiently complete and understandable for A1; do not require perfection.`;

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
  const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(cleaned);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return jsonResponse(res, 405, { error: 'Method not allowed' });
  if (!process.env.OPENAI_API_KEY) return jsonResponse(res, 500, { error: 'OPENAI_API_KEY is not configured on the server.' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { task, points, minWords, maxWords, text, image } = body;
    if (!task || !Array.isArray(points)) return jsonResponse(res, 400, { error: 'Task data is missing.' });
    if (!text && !image) return jsonResponse(res, 400, { error: 'No answer text or image was provided.' });
    if (typeof text === 'string' && text.length > 10000) return jsonResponse(res, 413, { error: 'Text is too long.' });
    if (typeof image === 'string' && image.length > 7000000) return jsonResponse(res, 413, { error: 'Image is too large. Please upload a smaller photo.' });

    const taskText = `TASK SITUATION:\n${task}\n\nREQUIRED POINTS:\n${points.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\nTARGET WORD COUNT: approximately ${minWords}-${maxWords} words.`;
    const userContent = [
      { type: 'input_text', text: `${taskText}\n\nEvaluate the learner's answer. Return the required JSON only.` }
    ];

    if (image) {
      userContent.push({ type: 'input_image', image_url: image });
    } else {
      userContent.push({ type: 'input_text', text: `LEARNER ANSWER:\n${text}` });
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        input: [
          { role: 'system', content: [{ type: 'input_text', text: SYSTEM_PROMPT }] },
          { role: 'user', content: userContent }
        ],
        max_output_tokens: 1800,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return jsonResponse(res, response.status, { error: data?.error?.message || 'OpenAI request failed.' });
    }

    const output = extractOutputText(data);
    const result = parseJson(output);
    return jsonResponse(res, 200, result);
  } catch (error) {
    console.error('check-schreiben error', error);
    return jsonResponse(res, 500, { error: 'Die KI-Prüfung konnte nicht durchgeführt werden.' });
  }
}
