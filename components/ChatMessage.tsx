"use client"

import { motion } from "framer-motion"
import { Bot, UserRound } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChatMessage as ChatMessageType } from "@/types/chat"

interface ChatMessageProps {
  message: ChatMessageType
}

function formatTimestamp(dateISO: string): string {
  try {
    return new Date(dateISO).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return ""
  }
}

function renderTextWithFormatting(text: string) {
  const linkRegex = /(\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s()]+)/g;
  const parts = text.split(linkRegex);

  return parts.map((part, i) => {
    if (!part) return null;

    const mdLinkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (mdLinkMatch) {
      return (
        <a
          key={i}
          href={mdLinkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline transition-colors break-all"
        >
          {renderBold(mdLinkMatch[1])}
        </a>
      );
    }

    const urlMatch = part.match(/^(https?:\/\/[^\s()]+)$/);
    if (urlMatch) {
      return (
        <a
          key={i}
          href={urlMatch[1]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline transition-colors break-all"
        >
          {urlMatch[1]}
        </a>
      );
    }

    return <span key={i}>{renderBold(part)}</span>;
  });
}

function renderBold(text: string) {
  const boldRegex = /(\*\*[^*]+\*\*)/g;
  const parts = text.split(boldRegex);

  return parts.map((part, i) => {
    const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
    if (boldMatch) {
      return <strong key={i} className="font-bold">{boldMatch[1]}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex w-full items-end gap-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/70 bg-card text-foreground">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[84%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm",
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md border border-border/70 bg-card text-card-foreground"
        )}
      >
        <p className="whitespace-pre-wrap break-words">{renderTextWithFormatting(message.content)}</p>
        <p
          className={cn(
            "mt-1 text-[11px]",
            isUser ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {formatTimestamp(message.createdAt)}
        </p>
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/50 bg-primary/10 text-primary">
          <UserRound className="h-4 w-4" />
        </div>
      )}
    </motion.div>
  )
}
