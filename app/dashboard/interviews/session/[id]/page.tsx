"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { generateInterviewResponse } from "@/lib/gemini"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Send, Clock, AlertCircle } from "lucide-react"

export default function InterviewSession({ params }: { params: { id: string } }) {
  // Extract id at the component level
  const id = params.id
  
  const [interview, setInterview] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [userAnswer, setUserAnswer] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [error, setError] = useState("")
  const [timeLeft, setTimeLeft] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Fetch interview data
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const interviewDoc = await getDoc(doc(db, "interviews", id)) // Use id directly

        if (interviewDoc.exists()) {
          const interviewData = { id: interviewDoc.id, ...interviewDoc.data() }
          setInterview(interviewData)
          setTimeLeft((interviewData as unknown as { duration: number }).duration * 60) // Convert minutes to seconds

          // If there are existing messages, load them
          if ('messages' in interviewData && Array.isArray(interviewData.messages) && interviewData.messages.length > 0) {
            setMessages(interviewData.messages)
          } else {
            // Start the interview with an introduction
            startInterview(interviewData)
          }
        } else {
          setError("Interview not found")
        }
      } catch (err) {
        console.error("Error fetching interview:", err)
        setError("Failed to load interview")
      } finally {
        setLoading(false)
      }
    }

    fetchInterview()
  }, [id]) // Use id in dependency array

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || !interview || interview.status === "completed") return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleInterviewEnd()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, interview])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const startInterview = async (interviewData: any) => {
    try {
      const categoryMap: { [key: string]: string } = {
        frontend: "Frontend Development",
        backend: "Backend Development",
        dsa: "Data Structures & Algorithms",
        leadership: "Leadership",
        "problem-solving": "Problem Solving",
        communication: "Communication",
        tech: "Tech Industry",
        finance: "Finance",
        healthcare: "Healthcare",
      }

      const categoryName = categoryMap[interviewData.category] || interviewData.category

      const systemPrompt = `You are an AI interviewer conducting a ${interviewData.difficulty} level interview about ${categoryName}. 
      Ask one question at a time and wait for the candidate's response. 
      After they answer, provide brief feedback and then ask the next question.
      The interview should last about ${interviewData.duration} minutes.
      Start by introducing yourself and asking the first question.`

      // Change the role from "system" to "user" to comply with Gemini's requirements
      const introMessage = {
        role: "user",
        content: systemPrompt,
      }

      const { text, success } = await generateInterviewResponse(
        "Please introduce yourself and ask the first interview question.",
        [introMessage],
      )

      if (success) {
        const newMessages = [
          introMessage,
          {
            role: "assistant",
            content: text,
          },
        ]

        setMessages(newMessages)

        // Update the interview document with the initial messages
        await updateDoc(doc(db, "interviews", interviewData.id), {
          messages: newMessages,
          lastUpdated: new Date(),
        })
      } else {
        setError("Failed to start the interview. Please try again.")
      }
    } catch (err) {
      console.error("Error starting interview:", err)
      setError("Failed to start the interview")
    }
  }

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return

    try {
      setSubmitting(true)

      // Add user's answer to messages
      const userMessage = {
        role: "user",
        content: userAnswer,
      }

      const updatedMessages = [...messages, userMessage]
      setMessages(updatedMessages)
      setUserAnswer("")

      // Generate AI response
      const { text, success } = await generateInterviewResponse(userAnswer, messages)

      if (success) {
        const aiMessage = {
          role: "model", // Change from "assistant" to "model"
          content: text,
        }

        const newMessages = [...updatedMessages, aiMessage]
        setMessages(newMessages)

        // Update the interview document
        await updateDoc(doc(db, "interviews", id), { // Use id directly
          messages: newMessages,
          lastUpdated: new Date(),
        })
      } else {
        setError("Failed to get interviewer response. Please try again.")
      }
    } catch (err) {
      console.error("Error submitting answer:", err)
      setError("Failed to submit your answer")
    } finally {
      setSubmitting(false)
    }
  }

  const handleInterviewEnd = async () => {
    try {
      // Update interview status
      await updateDoc(doc(db, "interviews", id), { // Already using id directly
        status: "completed",
        completedAt: new Date(),
      })
  
      // Generate feedback summary
      const feedbackPrompt = {
        role: "user", // Change from "system" to "user"
        content:
          "Please provide a comprehensive feedback summary of this interview. Include strengths, areas for improvement, and an overall score out of 100.",
      };
  
      const { text } = await generateInterviewResponse(
        "The interview is now complete. Please provide a comprehensive feedback summary.",
        [...messages, feedbackPrompt],
      )
  
      // Add feedback to interview document
      await updateDoc(doc(db, "interviews", id), { // Change params.id to id
        feedback: text,
      })
  
      // Redirect to feedback page
      router.push(`/dashboard/interviews/feedback/${id}`) // Change params.id to id
    } catch (err) {
      console.error("Error ending interview:", err)
      setError("Failed to end the interview properly")
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  if (loading) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Interview Session</h1>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className={`font-mono ${timeLeft < 60 ? "text-red-500" : ""}`}>{formatTime(timeLeft)}</span>
          <Button variant="outline" size="sm" onClick={handleInterviewEnd}>
            End Interview
          </Button>
        </div>
      </div>

      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            {interview?.category.charAt(0).toUpperCase() + interview?.category.slice(1)} Interview -{" "}
            {interview?.difficulty.charAt(0).toUpperCase() + interview?.difficulty.slice(1)} Level
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="bg-background border rounded-lg mb-4 p-4 h-[50vh] overflow-y-auto">
        <div className="space-y-4">
          {messages
            .filter((m) => m.role !== "system")
            .map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{message.role === "user" ? "You" : "AI"}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex gap-4">
        <Textarea
          placeholder="Type your answer here..."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="flex-1"
          disabled={submitting || interview?.status === "completed"}
        />
        <Button
          onClick={handleSubmitAnswer}
          disabled={!userAnswer.trim() || submitting || interview?.status === "completed"}
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
