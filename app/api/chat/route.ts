import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createGeminiChatStream, hasGeminiKey } from "@/lib/gemini"
import { checkRateLimit } from "@/lib/rate-limit"
import { createContextSnippet, retrieveRelevantSections } from "@/lib/retriever"
import {
  MAX_INPUT_LENGTH,
  MAX_HISTORY_LENGTH,
  sanitizeHistoryContent,
  sanitizeUserInput,
} from "@/lib/sanitize"
import type { ChatHistoryTurn } from "@/types/chat"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 30

const requestBodySchema = z.object({
  message: z.string().min(1).max(MAX_INPUT_LENGTH),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(MAX_HISTORY_LENGTH * 2),
      })
    )
    .max(8)
    .optional(),
})

const BLOCKED_MESSAGE =
  "I can help with Shabeeb's portfolio only. Please ask about his skills, projects, experience, contact, or hiring fit."

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown"
  }

  return request.headers.get("x-real-ip") ?? "unknown"
}

function toPlainTextResponse(message: string): NextResponse {
  return new NextResponse(message, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
    },
  })
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const ip = getClientIp(request)
    // Stricter minute limit to prevent quick bursts (5 requests per minute)
    const rateLimit = checkRateLimit(ip, { limit: 5, windowMs: 60_000 })
    // Daily limit to prevent abuse and reduce overall cost (30 requests per day)
    const dailyLimit = checkRateLimit(ip + "_daily", { limit: 30, windowMs: 24 * 60 * 60 * 1000 })

    if (!rateLimit.allowed) {
      const retryAfter = Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1_000))
      return NextResponse.json(
        { error: "Woah, speed racer! 🏎️ Slow down a bit. Give me a minute to catch my digital breath before we chat more." },
        { status: 429, headers: { "Retry-After": retryAfter.toString() } }
      )
    }

    if (!dailyLimit.allowed) {
      const retryAfter = Math.max(1, Math.ceil((dailyLimit.resetAt - Date.now()) / 1_000))
      return NextResponse.json(
        { error: "Phew! 😅 I need a break. You've hit your 30-message limit for today. Catch you tomorrow!" },
        { status: 429, headers: { "Retry-After": retryAfter.toString() } }
      )
    }

    let rawBody: unknown

    try {
      rawBody = await request.json()
    } catch {
      return NextResponse.json({ error: "Hmm, that didn't go through properly. Could you try asking again?" }, { status: 400 })
    }

    const parsed = requestBodySchema.safeParse(rawBody)

    if (!parsed.success) {
      return NextResponse.json({ error: "Your message seems a bit too long or contains unsupported characters. Please try a shorter message!" }, { status: 400 })
    }

    const sanitized = sanitizeUserInput(parsed.data.message)

    if (sanitized.blocked) {
      return toPlainTextResponse(BLOCKED_MESSAGE)
    }

    if (!sanitized.value) {
      return NextResponse.json({ error: "Question cannot be empty." }, { status: 400 })
    }

    if (!hasGeminiKey()) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing. Add it to .env.local." },
        { status: 500 }
      )
    }

    const relevantSections = retrieveRelevantSections(sanitized.value, 3)
    const context = createContextSnippet(relevantSections)
    const history: ChatHistoryTurn[] = (parsed.data.history ?? [])
      .map((item) => ({
        role: item.role,
        content: sanitizeHistoryContent(item.content),
      }))
      .filter((item) => item.content.length > 0)
      .slice(-6)

    const stream = createGeminiChatStream({
      question: sanitized.value,
      context,
      history,
    })

    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store, no-transform",
        "X-RateLimit-Remaining": Math.min(rateLimit.remaining, dailyLimit.remaining).toString(),
      },
    })
  } catch (error) {
    console.error("chat_api_error", error)
    return NextResponse.json(
      { error: "Unable to process the request right now." },
      { status: 500 }
    )
  }
}
