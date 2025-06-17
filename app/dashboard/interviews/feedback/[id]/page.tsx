"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Loader2, AlertCircle, ThumbsUp, ThumbsDown } from "lucide-react"

export default function InterviewFeedback({ params }: { params: { id: string } }) {
  const [interview, setInterview] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [score, setScore] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const interviewDoc = await getDoc(doc(db, "interviews", params.id))

        if (interviewDoc.exists()) {
          const interviewData = { id: interviewDoc.id, ...interviewDoc.data() }
          setInterview(interviewData)

          // Extract score from feedback if available
          if (interviewData.feedback) {
            const scoreMatch = interviewData.feedback.match(/(\d+)(?:\s*\/\s*|\s+out\s+of\s+)100/i)
            if (scoreMatch) {
              setScore(Number.parseInt(scoreMatch[1]))
            }
          }
        } else {
          setError("Interview not found")
        }
      } catch (err) {
        console.error("Error fetching interview:", err)
        setError("Failed to load interview feedback")
      } finally {
        setLoading(false)
      }
    }

    fetchInterview()
  }, [params.id])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
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
    <div className="container py-10 max-w-4xl">
      <Link href="/dashboard" className="flex items-center text-sm text-muted-foreground mb-6 hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-6">Interview Feedback</h1>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            {interview?.category.charAt(0).toUpperCase() + interview?.category.slice(1)} Interview -{" "}
            {interview?.difficulty.charAt(0).toUpperCase() + interview?.difficulty.slice(1)} Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">
                Completed on {interview?.completedAt?.toDate().toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">Duration: {interview?.duration} minutes</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold mb-1 flex items-center gap-2">
                <span className={getScoreColor(score)}>{score}</span>
                <span className="text-muted-foreground text-lg">/100</span>
              </div>
              <Progress value={score} className={`w-32 h-2 ${getProgressColor(score)}`} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Feedback Summary</h3>
            <div className="whitespace-pre-wrap bg-muted p-4 rounded-lg text-sm">
              {interview?.feedback || "No feedback available"}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Strengths</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start gap-2">
              <ThumbsUp className="h-5 w-5 text-green-500 mt-0.5" />
              <p>Clear communication and articulation of ideas</p>
            </div>
            <div className="flex items-start gap-2">
              <ThumbsUp className="h-5 w-5 text-green-500 mt-0.5" />
              <p>Good technical knowledge in core concepts</p>
            </div>
            <div className="flex items-start gap-2">
              <ThumbsUp className="h-5 w-5 text-green-500 mt-0.5" />
              <p>Structured approach to problem-solving</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start gap-2">
              <ThumbsDown className="h-5 w-5 text-red-500 mt-0.5" />
              <p>Provide more specific examples from past experience</p>
            </div>
            <div className="flex items-start gap-2">
              <ThumbsDown className="h-5 w-5 text-red-500 mt-0.5" />
              <p>Deepen knowledge in advanced topics</p>
            </div>
            <div className="flex items-start gap-2">
              <ThumbsDown className="h-5 w-5 text-red-500 mt-0.5" />
              <p>Work on concise answers while maintaining completeness</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <Button onClick={() => router.push("/dashboard")} variant="outline" className="flex-1">
          Return to Dashboard
        </Button>
        <Button onClick={() => router.push("/dashboard/interviews/new")} className="flex-1">
          Start New Interview
        </Button>
      </div>
    </div>
  )
}
