"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { ChatHistoryTurn, ChatMessage } from "@/types/chat"

const STORAGE_KEY = "portfolio-chat-history-v1"
const SEND_DEBOUNCE_MS = 450
const REQUEST_TIMEOUT_MS = 25_000
const MAX_HISTORY_ITEMS = 6

const INITIAL_ASSISTANT_MESSAGE =
  "Hi, I'm Shabeeb's AI assistant. Ask me about skills, projects, backend expertise, or how to contact him."

function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
  }
}

function getDefaultMessages(): ChatMessage[] {
  return [createMessage("assistant", INITIAL_ASSISTANT_MESSAGE)]
}

function isValidMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") {
    return false
  }

  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === "string" &&
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string" &&
    typeof candidate.createdAt === "string"
  )
}

function buildHistorySnapshot(messages: ChatMessage[]): ChatHistoryTurn[] {
  return messages
    .slice(-MAX_HISTORY_ITEMS)
    .map((message) => ({
      role: message.role,
      content: message.content.slice(0, 320),
    }))
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === "undefined") {
      return getDefaultMessages()
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) {
        return getDefaultMessages()
      }

      const parsed = JSON.parse(raw) as unknown
      if (!Array.isArray(parsed)) {
        return getDefaultMessages()
      }

      const validMessages = parsed.filter(isValidMessage)
      if (validMessages.length > 0) {
        return validMessages
      }

      return getDefaultMessages()
    } catch {
      return getDefaultMessages()
    }
  })
  const [isTyping, setIsTyping] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const lastSentAtRef = useRef(0)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  const resetChat = useCallback(() => {
    const defaultMessages = getDefaultMessages()
    setMessages(defaultMessages)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMessages))
  }, [])

  const sendMessage = useCallback(
    async (rawInput: string) => {
      const now = Date.now()
      if (now - lastSentAtRef.current < SEND_DEBOUNCE_MS) {
        return
      }

      if (isSending) {
        return
      }

      const content = rawInput.trim()

      if (!content) {
        return
      }

      lastSentAtRef.current = now

      const userMessage = createMessage("user", content)
      const assistantMessageId = crypto.randomUUID()
      const assistantPlaceholder: ChatMessage = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
      }

      const nextMessages = [...messages, userMessage, assistantPlaceholder]
      setMessages(nextMessages)
      setIsTyping(true)
      setIsSending(true)

      const abortController = new AbortController()
      const timeout = setTimeout(() => abortController.abort(), REQUEST_TIMEOUT_MS)

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: content,
            history: buildHistorySnapshot([...messages, userMessage]),
          }),
          signal: abortController.signal,
        })

        if (!response.ok) {
          let errorMessage = "Unable to fetch response right now."

          try {
            const payload = (await response.json()) as { error?: string }
            if (payload.error) {
              errorMessage = payload.error
            }
          } catch {
            // Ignore JSON parsing errors and keep default message.
          }

          throw new Error(errorMessage)
        }

        if (!response.body) {
          throw new Error("No response stream received.")
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let assistantText = ""

        while (true) {
          const { value, done } = await reader.read()
          if (done) {
            break
          }

          assistantText += decoder.decode(value, { stream: true })

          setMessages((current) =>
            current.map((item) =>
              item.id === assistantMessageId
                ? { ...item, content: assistantText }
                : item
            )
          )
        }

        assistantText += decoder.decode()

        if (!assistantText.trim()) {
          assistantText =
            "I could not find enough context for that. Try asking about Shabeeb's skills, projects, or contact details."
        }

        setMessages((current) =>
          current.map((item) =>
            item.id === assistantMessageId
              ? { ...item, content: assistantText }
              : item
          )
        )
      } catch (error) {
        const fallback =
          error instanceof Error
            ? error.message
            : "Something went wrong while fetching the answer."

        setMessages((current) =>
          current.map((item) =>
            item.id === assistantMessageId ? { ...item, content: fallback } : item
          )
        )
      } finally {
        clearTimeout(timeout)
        setIsTyping(false)
        setIsSending(false)
      }
    },
    [isSending, messages]
  )

  const hasUserMessages = useMemo(
    () => messages.some((message) => message.role === "user"),
    [messages]
  )

  return {
    messages,
    isTyping,
    isSending,
    hasUserMessages,
    sendMessage,
    resetChat,
  }
}
