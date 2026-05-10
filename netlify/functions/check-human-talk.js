const DEFAULT_API_URL = "https://api.deepseek.com/v1/chat/completions";
const DEFAULT_MODEL = "deepseek-chat";
const MAX_TEXT_LENGTH = 500;

const TYPE_LABELS = [
  "\u4eba\u8bdd\u5927\u5e08\u578b",
  "\u57fa\u672c\u4f1a\u8bf4\u4eba\u8bdd\u578b",
  "\u8f7b\u5fae\u5957\u8bdd\u578b",
  "AI\u5473\u8fc7\u91cd\u578b",
  "\u9886\u5bfc\u5e9f\u8bdd\u578b"
];

function jsonResponse(body, statusCode = 200) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(body)
  };
}

function getEnv(name) {
  return process.env[name] || "";
}

function clampScore(score) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeStringArray(value) {
  if (!Array.isArray(value)) {
    return null;
  }

  const items = value.map(normalizeString).filter(Boolean);
  return items.length ? items : null;
}

function getTypeByScore(score) {
  if (score >= 80) return TYPE_LABELS[0];
  if (score >= 60) return TYPE_LABELS[1];
  if (score >= 40) return TYPE_LABELS[2];
  if (score >= 20) return TYPE_LABELS[3];
  return TYPE_LABELS[4];
}

function normalizeTypeLabel(value, score) {
  const label = normalizeString(value);
  if (TYPE_LABELS.includes(label)) {
    return label;
  }
  return getTypeByScore(score);
}

function extractJson(content) {
  const trimmed = String(content || "").trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("DeepSeek response is not valid JSON.");
    }
    return JSON.parse(match[0]);
  }
}

function validateResult(value) {
  if (!value || typeof value !== "object") {
    throw new Error("DeepSeek result format is invalid.");
  }

  const score = clampScore(Number(value.score));
  const typeLabel = normalizeTypeLabel(value.typeLabel, score);
  const roastTitle = normalizeString(value.roastTitle);
  const explanation = normalizeString(value.explanation);
  const rewrite = normalizeString(value.rewrite);
  const problems = normalizeStringArray(value.problems);
  const suggestions = normalizeStringArray(value.suggestions);

  if (!Number.isFinite(score)) {
    throw new Error("DeepSeek score is not a number.");
  }

  if (!typeLabel || !roastTitle || !explanation || !rewrite) {
    throw new Error("DeepSeek result is missing required text fields.");
  }

  if (!problems || !suggestions) {
    throw new Error("DeepSeek problems or suggestions are invalid.");
  }

  return {
    score,
    typeLabel,
    roastTitle,
    problems: problems.slice(0, 3),
    explanation,
    suggestions: suggestions.slice(0, 3),
    rewrite
  };
}

function buildSystemPrompt() {
  return [
    'You are a Chinese copywriting evaluator for a website named "Ni Hui Shuo Ren Hua Ma".',
    "Your job is to evaluate whether the user's Chinese text sounds like natural human language.",
    "Analyze only the text after USER_TEXT in the user message.",
    "Return strict JSON only. Do not use markdown. Do not wrap the JSON in a code block.",
    "All output field values must be in Simplified Chinese.",
    "",
    "Do not say the text is garbled, full of symbols, full of question marks, or unreadable unless the actual USER_TEXT contains many meaningless symbols, mojibake, or repeated question marks.",
    "If USER_TEXT is normal Chinese but sounds like AI writing, bureaucracy, slogans, resume templates, or empty formal language, evaluate it based on cliché words, abstractness, lack of concrete details, AI-summary tone, and bureaucratic tone.",
    "",
    "The typeLabel must be exactly one of these Chinese labels:",
    TYPE_LABELS.join(" / "),
    "",
    "Scoring guide:",
    "80-96: very natural, concrete, emotional, direct, human-like. Usually includes real feelings, specific details, or a clear personal voice.",
    "60-79: mostly natural, but slightly polished, generic, or template-like.",
    "40-59: readable but noticeably cliché, abstract, over-polished, or lacking concrete details. It may sound like a resume template, safe social-media caption, or generic formal writing.",
    "20-39: strong AI-writing smell. Generic summary tone, empty positive wording, abstract concepts, with-the-development-of style openings, actively-embrace style wording, improve-comprehensive-ability style wording, or similar template language should usually fall here.",
    "0-19: heavy bureaucratic talk, meeting-speech style, official slogans, empty leadership language, or truly unreadable text.",
    "",
    "Important scoring calibration:",
    "If USER_TEXT sounds like a typical AI-generated paragraph with abstract positive phrases and no concrete example, score it between 20 and 45.",
    "If USER_TEXT contains phrases equivalent to with-the-development-of, deeply-changing, actively-embrace, or improve-comprehensive-ability, and has no concrete personal detail, it should usually be typeLabel AI味过重型 with score 20-45.",
    "If USER_TEXT sounds like leadership speech with phrases equivalent to unify-thinking, build-consensus, compact-responsibility, implement-effectively, or high-quality-development, score it between 5 and 25.",
    "If USER_TEXT sounds like a resume template with phrases equivalent to good-communication-skills, teamwork-spirit, quick-adaptation, or responsibility, score it between 35 and 60 unless it contains concrete examples.",
    "If USER_TEXT is a natural short sentence like a real chat message, do not punish it just because it is short.",
    "",
    "Style requirements:",
    "roastTitle should sound like a sharp but friendly Chinese internet comment.",
    "explanation should explain the score in a conversational way, not like a formal report.",
    "suggestions should be practical, concrete, and conversational.",
    "rewrite should rewrite the original text into more natural Chinese human language.",
    "",
    "Safety rules:",
    "Comment only on the text, not the user.",
    "No vulgarity, discrimination, political content, personal attacks, or harassment.",
    "",
    "Required JSON shape:",
    '{"score":number,"typeLabel":"string","roastTitle":"string","problems":["string","string","string"],"explanation":"string","suggestions":["string","string","string"],"rewrite":"string"}'
  ].join("\n");
}

function buildUserMessage(text) {
  return [
    "Please analyze only this USER_TEXT.",
    "Do not analyze examples. Do not invent content.",
    "",
    "USER_TEXT:",
    text,
    "",
    "Return strict JSON with these fields:",
    '{"score":number,"typeLabel":"string","roastTitle":"string","problems":["string","string","string"],"explanation":"string","suggestions":["string","string","string"],"rewrite":"string"}',
    "",
    "Remember: all output values must be Simplified Chinese."
  ].join("\n");
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse({ ok: false, error: "Only POST requests are allowed." }, 405);
  }

  let text = "";

  try {
    const bodyText = event.isBase64Encoded
      ? Buffer.from(event.body || "", "base64").toString("utf8")
      : event.body || "{}";

    const parsedBody = JSON.parse(bodyText);
    text = normalizeString(parsedBody.text);
  } catch {
    return jsonResponse({ ok: false, error: "Request body must be valid JSON." }, 400);
  }

  if (!text) {
    return jsonResponse({ ok: false, error: "text cannot be empty." }, 400);
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return jsonResponse({ ok: false, error: "text cannot exceed 500 characters." }, 400);
  }

  const apiKey = getEnv("DEEPSEEK_API_KEY");

  if (!apiKey) {
    return jsonResponse({ ok: false, error: "Missing environment variable DEEPSEEK_API_KEY." }, 500);
  }

  const apiUrl = getEnv("DEEPSEEK_API_URL") || DEFAULT_API_URL;
  const model = getEnv("DEEPSEEK_MODEL") || DEFAULT_MODEL;
  const userMessage = buildUserMessage(text);

  console.log("Received text:", text);
  console.log("User message:", userMessage);

  try {
    const deepseekResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: buildSystemPrompt()
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!deepseekResponse.ok) {
      const errorText = await deepseekResponse.text();
      return jsonResponse(
        {
          ok: false,
          error: `DeepSeek request failed: ${deepseekResponse.status} ${errorText.slice(0, 200)}`
        },
        502
      );
    }

    const data = await deepseekResponse.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return jsonResponse({ ok: false, error: "DeepSeek returned empty content." }, 502);
    }

    const parsed = extractJson(content);
    const result = validateResult(parsed);

    return jsonResponse({ ok: true, result });
  } catch (error) {
    return jsonResponse(
      {
        ok: false,
        error: error instanceof Error ? error.message : "DeepSeek call failed."
      },
      502
    );
  }
};