// ============================================================
// AI Service — Unified chat interface for OpenAI, Claude, Gemini
// ============================================================

import { AIProvider, AIConfig, ChatMessage } from '../types/ai';

export interface ChatResponse {
  content: string;
  usage?: { promptTokens: number; completionTokens: number };
  error?: string;
}

function buildMessages(history: ChatMessage[]): { role: string; content: string }[] {
  const systemPrompt = `You are Nexus Tab Assistant, a helpful AI that controls a productivity dashboard.

CRITICAL: Analyze the user's intent before choosing an action. Same words can mean different actions:
- "Clean up notes" / "Clear notes" / "Delete notes" / "Empty notes" / "Clear all notes" / "Remove notes" → CLEAR (action: clear_notes, no content)
- "Add note: buy milk" / "Save: buy milk" / "Remember: meeting at 3pm" → ADD content to notes (action: add_note)
- "Remove link X" / "Delete link X" → remove_link
- "Add link X" → add_link

Always infer intent. "Clean up notes" means clear/empty notes, NOT add text "Clean up notes." to notes.

Available actions (include exactly one JSON in response, no markdown):
ADD: {"action":"add_task","payload":{"text":"..."}} {"action":"add_link","payload":{"name":"...","url":"..."}}
{"action":"add_note","payload":{"content":"..."}} {"action":"add_rss_feed","payload":{"url":"...","name":"..."}}
CLEAR/REMOVE: {"action":"clear_notes"} {"action":"delete_task","payload":{"id":"..."}}
{"action":"remove_link","payload":{"name":"..."}} or {"action":"remove_link","payload":{"id":"..."}}
{"action":"remove_rss_feed","payload":{"url":"..."}}
OTHER: {"action":"layout_change","payload":{"layout":"focus"}} (layout: focus/dashboard/workflow)
Payload fields: name, url, text, content, layout, id — use exact keys.`;
  return [
    { role: 'system', content: systemPrompt },
    ...history.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content })),
  ];
}

export async function sendChat(config: AIConfig, messages: ChatMessage[]): Promise<ChatResponse> {
  const provider = config.provider;
  const built = buildMessages(messages);

  try {
    if (provider === 'openai') {
      return await chatOpenAI(config.openai, built);
    }
    if (provider === 'claude') {
      return await chatClaude(config.claude, built);
    }
    if (provider === 'gemini') {
      return await chatGemini(config.gemini, built);
    }
    return { content: '', error: `Unknown provider: ${provider}` };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { content: '', error: msg };
  }
}

async function chatOpenAI(
  cfg: { apiKey: string; model: string; baseUrl?: string },
  messages: { role: string; content: string }[]
): Promise<ChatResponse> {
  if (!cfg.apiKey?.trim()) return { content: '', error: 'OpenAI API key required' };
  const url = (cfg.baseUrl || 'https://api.openai.com/v1').replace(/\/$/, '') + '/chat/completions';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify({
      model: cfg.model || 'gpt-4o-mini',
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      max_tokens: 1024,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `OpenAI error ${res.status}`);
  }
  const data = await res.json();
  const choice = data.choices?.[0];
  const content = choice?.message?.content ?? '';
  const usage = data.usage
    ? { promptTokens: data.usage.prompt_tokens ?? 0, completionTokens: data.usage.completion_tokens ?? 0 }
    : undefined;
  return { content, usage };
}

async function chatClaude(
  cfg: { apiKey: string; model: string },
  messages: { role: string; content: string }[]
): Promise<ChatResponse> {
  if (!cfg.apiKey?.trim()) return { content: '', error: 'Claude API key required' };
  const [system, ...rest] = messages.filter(m => m.role === 'system');
  const apiMessages = rest.map(m => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': cfg.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: cfg.model || 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: system?.content || '',
      messages: apiMessages,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Claude error ${res.status}`);
  }
  const data = await res.json();
  const textBlock = data.content?.find((b: any) => b.type === 'text');
  const content = textBlock?.text ?? '';
  const usage = data.usage
    ? { promptTokens: data.usage.input_tokens ?? 0, completionTokens: data.usage.output_tokens ?? 0 }
    : undefined;
  return { content, usage };
}

async function chatGemini(
  cfg: { apiKey: string; model: string },
  messages: { role: string; content: string }[]
): Promise<ChatResponse> {
  if (!cfg.apiKey?.trim()) return { content: '', error: 'Gemini API key required' };
  const parts = messages.map(m => ({ text: `[${m.role}]\n${m.content}` })).join('\n\n');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${cfg.model || 'gemini-1.5-flash'}:generateContent?key=${cfg.apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: parts }] }],
      generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Gemini error ${res.status}`);
  }
  const data = await res.json();
  const candidate = data.candidates?.[0];
  const textPart = candidate?.content?.parts?.find((p: any) => p.text);
  const content = textPart?.text ?? '';
  const usage = data.usageMetadata
    ? { promptTokens: data.usageMetadata.promptTokenCount ?? 0, completionTokens: data.usageMetadata.candidatesTokenCount ?? 0 }
    : undefined;
  return { content, usage };
}
