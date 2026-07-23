"use client"

import { useEffect } from "react"

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api"

export function BackendHelloLogger() {
  useEffect(() => {
    const controller = new AbortController()

    async function logBackendHello() {
      try {
        const response = await fetch(API_URL, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Backend returned HTTP ${response.status}`)
        }

        const message = await response.text()
        console.log(message)
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Cannot get backend hello message:", error)
        }
      }
    }

    void logBackendHello()

    return () => controller.abort()
  }, [])

  return null
}
