export type ChatRole = "user" | "assistant"

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  createdAt: string
}

export interface ChatHistoryTurn {
  role: ChatRole
  content: string
}

export interface PortfolioSection {
  id: string
  keywords: string[]
  content: string
}
