"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Settings, User, MicOff, Calendar, Clock, MapPin, Phone, Heart } from "lucide-react"
import { Inter, Poppins, Source_Sans_3 } from "next/font/google"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
})

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function HealthcareChatAgent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your healthcare assistant. I can help you book appointments, find doctors, and answer medical questions. How can I assist you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I understand you're looking to book an appointment. Let me help you find the right doctor. Could you please tell me what type of specialist or service you need?",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      className={`min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors ${inter.variable} ${poppins.variable} ${sourceSans.variable}`}
    >
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-strong shadow-sm transition-colors">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full overflow-hidden bg-white dark:bg-slate-700 shadow-md border-2 border-slate-200 dark:border-slate-600">
                <Image
                  src="/images/iasys-logo.jpeg"
                  alt="Iasys Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-contrast-high font-poppins">
                  Iasys - your personal healthcare guide
                </h1>
                <p className="text-sm text-contrast-accessible font-source-sans">
                  Book appointments • Get medical info
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-contrast-medium hover:text-contrast-high hover:bg-slate-100 dark:hover:bg-slate-700 focus-visible-high-contrast"
                aria-label="Toggle microphone"
              >
                <MicOff className="w-5 h-5" />
              </Button>
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                className="text-contrast-medium hover:text-contrast-high hover:bg-slate-100 dark:hover:bg-slate-700 focus-visible-high-contrast"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-contrast-medium hover:text-contrast-high hover:bg-slate-100 dark:hover:bg-slate-700 focus-visible-high-contrast"
                aria-label="User profile"
              >
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6" role="log" aria-label="Chat messages">
            <div className="max-w-2xl space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  role="article"
                  aria-label={`${message.role === "user" ? "Your" : "Assistant"} message`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-700 dark:from-teal-500 dark:to-teal-600 flex-shrink-0 shadow-md border-2 border-teal-200 dark:border-teal-400">
                      <AvatarFallback className="bg-gradient-to-br from-teal-600 to-teal-700 dark:from-teal-500 dark:to-teal-600 text-white border-0">
                        <Heart className="w-5 h-5" aria-hidden="true" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className={`max-w-[80%] ${message.role === "user" ? "order-first" : ""}`}>
                    <Card
                      className={`p-4 shadow-md transition-colors ${
                        message.role === "user"
                          ? "bg-blue-700 dark:bg-blue-800 text-white border-2 border-blue-600 dark:border-blue-700"
                          : "bg-surface-elevated border-2 border-strong shadow-lg"
                      }`}
                    >
                      <p
                        className={`text-sm leading-relaxed font-inter ${
                          message.role === "user" ? "text-white" : "text-contrast-high"
                        }`}
                      >
                        {message.content}
                      </p>
                    </Card>
                    <p className="text-xs mt-2 text-contrast-accessible font-source-sans">
                      <time dateTime={message.timestamp.toISOString()}>
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </time>
                    </p>
                  </div>

                  {message.role === "user" && (
                    <Avatar className="w-10 h-10 bg-slate-400 dark:bg-slate-500 flex-shrink-0 shadow-md border-2 border-slate-300 dark:border-slate-400">
                      <AvatarFallback className="bg-slate-400 dark:bg-slate-500 text-white border-0">
                        <User className="w-5 h-5" aria-hidden="true" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-4 justify-start" aria-label="Assistant is typing">
                  <Avatar className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-700 dark:from-teal-500 dark:to-teal-600 flex-shrink-0 shadow-md border-2 border-teal-200 dark:border-teal-400">
                    <AvatarFallback className="bg-gradient-to-br from-teal-600 to-teal-700 dark:from-teal-500 dark:to-teal-600 text-white border-0">
                      <Heart className="w-5 h-5" aria-hidden="true" />
                    </AvatarFallback>
                  </Avatar>
                  <Card className="p-4 bg-surface-elevated border-2 border-strong shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1" aria-hidden="true">
                        <div
                          className="w-2 h-2 bg-slate-600 dark:bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-slate-600 dark:bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-slate-600 dark:bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                      <span className="text-sm text-contrast-medium">Typing...</span>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white dark:bg-slate-800 border-t border-strong shadow-lg">
            <div className="max-w-2xl flex gap-3">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message or ask about appointments..."
                  className="pr-12 border-2 border-strong focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 bg-white dark:bg-slate-700 text-contrast-high placeholder:text-contrast-accessible shadow-sm"
                  disabled={isLoading}
                  aria-label="Type your message"
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 shadow-md border-2 border-blue-600 focus-visible-high-contrast disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white dark:bg-slate-800 border-l border-strong p-6 space-y-6 shadow-lg">
          {/* Quick Actions */}
          <section aria-labelledby="quick-actions-heading">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-700 dark:text-blue-400" aria-hidden="true" />
              <h3 id="quick-actions-heading" className="font-semibold text-contrast-high font-poppins">
                Quick Actions
              </h3>
            </div>
            <div className="space-y-3" role="group" aria-labelledby="quick-actions-heading">
              <Button className="w-full bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white justify-start shadow-md border-2 border-blue-600 focus-visible-high-contrast">
                Book New Appointment
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-contrast-high border-2 border-strong bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 focus-visible-high-contrast"
              >
                Reschedule
              </Button>
              <Button className="w-full bg-red-700 hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700 text-white justify-start shadow-md border-2 border-red-600 focus-visible-high-contrast">
                Emergency Care
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-contrast-high border-2 border-strong bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 focus-visible-high-contrast"
              >
                Prescription Refill
              </Button>
            </div>
          </section>

          {/* Upcoming Appointments */}
          <section aria-labelledby="upcoming-appointments-heading">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-700 dark:text-blue-400" aria-hidden="true" />
              <h3 id="upcoming-appointments-heading" className="font-semibold text-contrast-high font-poppins">
                Upcoming
              </h3>
            </div>

            <Card className="p-4 border-2 border-strong bg-surface-elevated shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm font-medium text-contrast-high">Consultation</p>
                  <p className="text-xs text-contrast-accessible">
                    <time dateTime="2024-01-15">2024-01-15</time>
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-700 dark:text-blue-400" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-contrast-high">Dr. Sarah Johnson</p>
                    <p className="text-xs text-contrast-accessible">Cardiology</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-contrast-accessible">
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  <span>10:30 AM</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-contrast-accessible">
                  <MapPin className="w-3 h-3" aria-hidden="true" />
                  <span>Medical Center - Floor 3</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-transparent border-2 border-strong text-contrast-high hover:bg-slate-100 dark:hover:bg-slate-700 focus-visible-high-contrast"
                >
                  Reschedule
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-contrast-medium hover:text-contrast-high hover:bg-slate-100 dark:hover:bg-slate-700 focus-visible-high-contrast"
                  aria-label="Call doctor"
                >
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Second appointment */}
            <Card className="p-4 border-2 border-strong bg-surface-elevated mt-3 shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm font-medium text-contrast-high">Follow-up</p>
                  <p className="text-xs text-contrast-accessible">
                    <time dateTime="2024-01-20">2024-01-20</time>
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-700 dark:text-blue-400" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-contrast-high">Dr. Michael Chen</p>
                    <p className="text-xs text-contrast-accessible">Dermatology</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-contrast-accessible">
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  <span>2:15 PM</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-contrast-accessible">
                  <MapPin className="w-3 h-3" aria-hidden="true" />
                  <span>Video Call</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-transparent border-2 border-strong text-contrast-high hover:bg-slate-100 dark:hover:bg-slate-700 focus-visible-high-contrast"
                >
                  Reschedule
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-contrast-medium hover:text-contrast-high hover:bg-slate-100 dark:hover:bg-slate-700 focus-visible-high-contrast"
                  aria-label="Call doctor"
                >
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
