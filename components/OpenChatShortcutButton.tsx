"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OpenChatShortcutButton() {
  const openChat = () => {
    window.dispatchEvent(new CustomEvent("open-shabeeb-chat"))
  }

  return (
    <Button
      type="button"
      onClick={openChat}
      className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
    >
      Chat with AI assistant
      <MessageCircle className="h-4 w-4" />
    </Button>
  )
}
