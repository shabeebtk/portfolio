// Max input length matching the UI's maxLength
export const MAX_INPUT_LENGTH = 200

export interface SanitizedInputResult {
  value: string
  blocked: boolean
  reason?: string
}

const promptInjectionPatterns: RegExp[] = [
  /ignore\s+(all\s+)?(previous|prior|system|developer)\s+instructions?/i,
  /reveal\s+(the\s+)?(system|developer)\s+prompt/i,
  /pretend\s+to\s+be\s+.*assistant/i,
  /act\s+as\s+.*(system|developer)/i,
  /jailbreak|bypass|override|prompt injection/i,
]

const dangerousMarkupPatterns: RegExp[] = [
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
  /javascript:/gi,
  /data:text\/html/gi,
  /onerror\s*=/gi,
  /onload\s*=/gi,
]

function stripDangerousMarkup(value: string): string {
  let cleaned = value

  for (const pattern of dangerousMarkupPatterns) {
    cleaned = cleaned.replace(pattern, "")
  }

  cleaned = cleaned.replace(/<[^>]+>/g, "")

  return cleaned
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim()
}

export function sanitizeUserInput(rawValue: string): SanitizedInputResult {
  const withoutControls = rawValue.replace(/[\u0000-\u001F\u007F]/g, " ")
  const withoutMarkup = stripDangerousMarkup(withoutControls)
  const normalized = normalizeWhitespace(withoutMarkup).slice(0, MAX_INPUT_LENGTH)

  if (normalized.length === 0) {
    return { value: "", blocked: true, reason: "empty_input" }
  }

  const blocked = promptInjectionPatterns.some((pattern) => pattern.test(normalized))

  if (blocked) {
    return { value: normalized, blocked: true, reason: "prompt_injection" }
  }

  return { value: normalized, blocked: false }
}

export function sanitizeHistoryContent(value: string): string {
  return normalizeWhitespace(stripDangerousMarkup(value)).slice(0, 300)
}
