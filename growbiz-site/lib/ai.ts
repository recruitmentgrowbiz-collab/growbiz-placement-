const OPENAI_API_BASE = "https://api.openai.com/v1";

export class AIUnavailableError extends Error {}

/**
 * Every AI feature in this app is assistive-only, per the brief's own
 * guardrail ("Assistive only; human review for consequential hiring
 * decisions"): this never returns something that gets saved or acted on
 * automatically — callers always show the result as an editable suggestion,
 * never a fact, and log it via ai_generations before returning it.
 */
export async function generateWithAI(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 500
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new AIUnavailableError(
      "AI features aren't configured yet. Add OPENAI_API_KEY to enable them."
    );
  }

  const res = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature: 0.6,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`AI request failed: ${body}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("AI returned an empty response.");
  return text.trim();
}
