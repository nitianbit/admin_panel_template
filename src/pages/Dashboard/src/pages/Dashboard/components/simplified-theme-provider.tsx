// Create a simplified theme provider to replace the missing one
import type React from "react"

type ThemeProviderProps = {
  children: React.ReactNode
  [key: string]: any
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <div {...props}>{children}</div>
}
