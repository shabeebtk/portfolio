import portfolioData from "@/data/portfolio.json"
import type { PortfolioSection } from "@/types/chat"

const sections = portfolioData as PortfolioSection[]

const intentMap: Record<string, string[]> = {
  about: ["who", "about", "summary", "intro", "background", "shabeeb"],
  skills: [
    "skills",
    "technology",
    "technologies",
    "stack",
    "backend",
    "frontend",
    "django",
    "fastapi",
    "react",
    "next",
    "typescript",
  ],
  experience: [
    "experience",
    "career",
    "work",
    "senior",
    "saas",
    "api",
    "apis",
    "mfa",
    "sso",
    "integration",
    "enterprise",
  ],
  projects: ["project", "projects", "goatza", "playoff", "platform"],
  hire: ["hire", "why", "strength", "value", "fit", "choose"],
  contact: [
    "contact",
    "email",
    "phone",
    "linkedin",
    "github",
    "availability",
    "resume",
  ],
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^\w\s.-]/g, " ").replace(/\s+/g, " ").trim()
}

function tokenize(value: string): string[] {
  return normalizeText(value).split(" ").filter((token) => token.length > 1)
}

function detectIntents(query: string): Set<string> {
  const normalized = normalizeText(query)
  const detected = new Set<string>()

  for (const [intent, words] of Object.entries(intentMap)) {
    if (words.some((word) => normalized.includes(word))) {
      detected.add(intent)
    }
  }

  return detected
}

export function retrieveRelevantSections(
  query: string,
  maxSections = 3
): PortfolioSection[] {
  const normalizedQuery = normalizeText(query)
  const tokens = tokenize(query)
  const intents = detectIntents(query)

  const scored = sections.map((section) => {
    const sectionContent = normalizeText(section.content)
    let score = 0

    if (intents.has(section.id)) {
      score += 6
    }

    for (const keyword of section.keywords) {
      if (normalizedQuery.includes(keyword.toLowerCase())) {
        score += 4
      }
    }

    for (const token of tokens) {
      if (sectionContent.includes(token)) {
        score += 1
      }
    }

    return { section, score }
  })

  scored.sort((a, b) => b.score - a.score)

  const relevant = scored
    .filter((entry) => entry.score > 0)
    .slice(0, Math.max(2, Math.min(maxSections, 3)))
    .map((entry) => entry.section)

  if (relevant.length > 0) {
    return relevant
  }

  return sections.filter((section) =>
    ["about", "skills", "experience"].includes(section.id)
  )
}

export function createContextSnippet(relevantSections: PortfolioSection[]): string {
  return relevantSections
    .map(
      (section) =>
        `Section: ${section.id.toUpperCase()}\nKeywords: ${section.keywords.join(", ")}\nContent: ${section.content}`
    )
    .join("\n\n")
}
