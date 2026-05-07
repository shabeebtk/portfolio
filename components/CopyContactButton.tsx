"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

interface CopyContactButtonProps extends React.ComponentProps<typeof Button> {
  contactValue: string
  label: string
  icon: React.ReactNode
}

export default function CopyContactButton({
  contactValue,
  label,
  icon,
  className,
  ...props
}: CopyContactButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contactValue)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy", err)
    }
  }

  return (
    <Button
      type="button"
      className={cn("relative overflow-hidden justify-center", className)}
      onClick={handleCopy}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.div
            key="copied"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center w-full gap-2"
          >
            <span className="font-medium text-green-500 dark:text-green-400">Copied to clipboard!</span>
            <Check className="h-4 w-4 text-green-500 dark:text-green-400" />
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center w-full gap-2"
          >
            <span>{label}</span>
            {icon}
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}
