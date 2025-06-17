"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Plus, Trash2, Loader2, AlertCircle } from "lucide-react"

export default function CustomInterview() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [difficulty, setDifficulty] = useState("medium")
  const [duration, setDuration] = useState(15)
  const [questions, setQuestions] = useState<string[]>([""])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAddQuestion = () => {
    setQuestions([...questions, ""])
  }

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = [...questions]
    newQuestions.splice(index, 1)
    setQuestions(newQuestions)
  }

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[index] = value
    setQuestions(newQuestions)
  }

  const handleCreateInterview = async () => {
    // Validate form
    if (!title.trim()) {
      setError("Please enter an interview title")
      return
    }

    if (questions.filter((q) => q.trim()).length === 0) {
      setError("Please add at least one question")
      return
    }

    try {
      setLoading(true)
      setError("")

      const user = auth.currentUser
      if (!user) {
        router.push("/login")
        return
      }

      // Filter out empty questions
      const filteredQuestions = questions.filter((q) => q.trim())

      // Create a new custom interview in Firestore
      const interviewRef = await addDoc(collection(db, "interviews"), {
        userId: user.uid,
        title,
        description,
        difficulty,
        duration,
        questions: filteredQuestions,
        isCustom: true,
        status: "in-progress",
        createdAt: serverTimestamp(),
        answers: [],
        feedback: null,
      })

      // Redirect to the interview session
      router.push(`/dashboard/interviews/session/${interviewRef.id}`)
    } catch (err) {
      console.error("Error creating custom interview:", err)
      setError("Failed to create interview. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <Link href="/dashboard" className="flex items-center text-sm text-muted-foreground mb-6 hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-6">Create Custom Interview</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Custom Interview Details</CardTitle>
          <CardDescription>Create your own interview with custom questions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Interview Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Frontend Developer Interview"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the interview focus"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Interview Duration (minutes)</Label>
                <span className="text-sm font-medium">{duration} min</span>
              </div>
              <Slider
                value={[duration]}
                min={5}
                max={30}
                step={5}
                onValueChange={(value) => setDuration(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5 min</span>
                <span>30 min</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Interview Questions</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddQuestion} className="h-8">
                <Plus className="h-4 w-4 mr-1" />
                Add Question
              </Button>
            </div>

            {questions.map((question, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={question}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  placeholder={`Question ${index + 1}`}
                  className="flex-1"
                />
                {questions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveQuestion(index)}
                    className="h-10 w-10 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateInterview} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Interview...
              </>
            ) : (
              "Create Interview"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
