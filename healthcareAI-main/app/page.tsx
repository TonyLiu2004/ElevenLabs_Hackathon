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
import {startConversation} from "@/AAAA/script"

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

interface Appointment {
  id: string
  date: string
  time: string
  doctor: string
  location: string
}

export default function HealthcareChatAgent() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const [appointments, setAppointments] = useState<Appointment[]>([
  {
    id: "1",
    date: "2025-08-01",
    time: "10:30 AM",
    doctor: "Dr. Emily Zhang",
    location: "Room 201, Midtown Clinic"
  }
]);


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
          <div className="p-6 bg-white dark:bg-slate-800 border-t border-strong shadow-lg flex items-center justify-center">
            <div className="max-w-2xl flex gap-3">
              <button
                className="px-4 py-4 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition text-3xl flex items-center justify-center"
                onClick={startConversation}
              >
                🎙️
              </button>
            </div>
          </div>
          </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white dark:bg-slate-800 border-l border-strong p-6 space-y-6 shadow-lg">
          {/* Quick Actions */}
          <h2 style={{ textAlign: "center", fontWeight: "bold" }}>Your Upcoming Appointments</h2>
          {appointments.map((appointment) => (
        <Card
          key={appointment.id}
          className="p-4 border-2 border-strong bg-surface-elevated shadow-lg"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-sm font-medium text-contrast-high">Consultation</p>
              <p className="text-xs text-contrast-accessible">
                <time dateTime={appointment.date}>{appointment.date}</time>
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <User
                className="w-4 h-4 text-blue-700 dark:text-blue-400"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-medium text-contrast-high">
                  {appointment.doctor}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-contrast-accessible">
              <Clock className="w-3 h-3" aria-hidden="true" />
              <span>{appointment.time}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-contrast-accessible">
              <MapPin className="w-3 h-3" aria-hidden="true" />
              <span>{appointment.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
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
      ))}

          

          


        </div>
      </div>
    </div>
  )
}
