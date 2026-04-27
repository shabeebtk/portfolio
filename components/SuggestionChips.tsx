"use client"

import { Button } from "@/components/ui/button"

interface SuggestionChipsProps {
  suggestions: string[]
  onSelect: (value: string) => void
  disabled?: boolean
}

export default function SuggestionChips({
  suggestions,
  onSelect,
  disabled = false,
}: SuggestionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion}
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          className="h-auto rounded-full px-3 py-1.5 text-left text-xs"
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  )
}
