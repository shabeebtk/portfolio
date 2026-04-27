"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  MessageCircle,
  Moon,
  RefreshCcw,
  SendHorizontal,
  Sun,
  X,
} from "lucide-react"
import ChatMessage from "@/components/ChatMessage"
import SuggestionChips from "@/components/SuggestionChips"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useChat } from "@/hooks/useChat"

const THEME_STORAGE_KEY = "portfolio-theme"

const suggestions = [
  "What projects has Shabeeb built?",
  "What backend experience does he have?",
  "Why should I hire him?",
  "What technologies does he know?",
  "Is he experienced in Django?",
  "Contact Shabeeb",
]

type ThemeMode = "light" | "dark"

function resolveTheme(): ThemeMode {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === "light" || stored === "dark") {
    return stored
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function applyTheme(theme: ThemeMode): void {
  document.documentElement.classList.toggle("dark", theme === "dark")
  localStorage.setItem(THEME_STORAGE_KEY, theme)
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasMountedPanel, setHasMountedPanel] = useState(false)
  const [input, setInput] = useState("")
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "light"
    }
    return resolveTheme()
  })
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { messages, isTyping, isSending, hasUserMessages, sendMessage, resetChat } =
    useChat()

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const container = messagesContainerRef.current
    if (!container) {
      return
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, isTyping, isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const frame = window.requestAnimationFrame(() => inputRef.current?.focus())
    return () => window.cancelAnimationFrame(frame)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isOpen])

  useEffect(() => {
    const onOpenChat = () => {
      setHasMountedPanel(true)
      setIsOpen(true)
    }

    window.addEventListener("open-shabeeb-chat", onOpenChat)
    return () => window.removeEventListener("open-shabeeb-chat", onOpenChat)
  }, [])

  const showSuggestionChips = useMemo(() => !hasUserMessages, [hasUserMessages])

  const handleSend = async (value = input) => {
    if (isSending) {
      return
    }

    const question = value.trim()
    if (!question) {
      return
    }

    setInput("")
    await sendMessage(question)
  }

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark"
    setTheme(nextTheme)
  }

  const toggleOpen = () => {
    setIsOpen((current) => {
      const next = !current
      if (next) {
        setHasMountedPanel(true)
      }
      return next
    })
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && hasMountedPanel && (
          <motion.section
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className="fixed right-2 bottom-20 z-50 w-[min(420px,calc(100vw-1rem))] md:right-5"
            aria-label="Shabeeb AI portfolio assistant"
          >
            <div className="overflow-hidden rounded-3xl border border-border/70 bg-background/95 shadow-[0_24px_80px_-28px_rgba(0,0,0,0.42)] backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-border/70 bg-muted/40 px-4 py-3">
                <div>
                  <p className="font-heading text-sm font-semibold tracking-tight">
                    Shabeeb AI Assistant
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Know more about Shabeeb
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                  >
                    {theme === "dark" ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={resetChat}
                    aria-label="Reset conversation"
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close chat"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div
                ref={messagesContainerRef}
                className="max-h-[420px] space-y-3 overflow-y-auto px-3 py-4"
              >
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-2xl border border-border/70 bg-card px-3 py-2 text-sm text-muted-foreground"
                  >
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.2s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.1s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                    </span>
                    Thinking...
                  </motion.div>
                )}
              </div>

              {showSuggestionChips && (
                <div className="border-t border-border/70 px-3 py-3">
                  <SuggestionChips
                    suggestions={suggestions}
                    onSelect={(suggestion) => void handleSend(suggestion)}
                    disabled={isSending}
                  />
                </div>
              )}

              <div className="border-t border-border/70 bg-muted/30 p-3">
                <div className="flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    maxLength={500}
                    autoComplete="off"
                    placeholder="Ask about Shabeeb's skills, work, or projects..."
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault()
                        void handleSend()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="icon"
                    disabled={isSending || input.trim().length === 0}
                    onClick={() => void handleSend()}
                    aria-label="Send message"
                  >
                    <SendHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={toggleOpen}
        className="fixed right-4 bottom-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-[linear-gradient(135deg,#1f2937,#111827)] text-white shadow-[0_12px_40px_-14px_rgba(15,23,42,0.7)] md:right-5"
        aria-label={isOpen ? "Close chat assistant" : "Open chat assistant"}
      >
        <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.22),transparent_45%)]" />
        {isOpen ? (
          <X className="relative h-5 w-5" />
        ) : (
          <span className="relative inline-flex items-center gap-1">
            <MessageCircle className="h-5 w-5" />
          </span>
        )}
      </motion.button>
    </>
  )
}
