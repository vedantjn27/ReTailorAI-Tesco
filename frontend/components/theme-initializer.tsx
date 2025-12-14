"use client"

import { useEffect } from "react"

export function ThemeInitializer() {
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "dark"
    const root = document.documentElement

    if (theme === "light") {
      root.classList.remove("dark")
    } else if (theme === "dark") {
      root.classList.add("dark")
    } else if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.toggle("dark", systemTheme === "dark")
    }
  }, [])

  return null
}
