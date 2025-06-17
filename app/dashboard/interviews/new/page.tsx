"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewInterview() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [category, setCategory] = useState(categoryParam || "frontend")
  const [difficulty, setDifficulty] = useState("medium")
  const [duration, setDuration] = useState(15)
  const [loading, setLoading] = useState(false)

  const handleStartInterview = async () => {
    try {
      setLoading(true)
      const user = auth.currentUser
      if (!user) {
        router.push("/login")
        return
      }

      // Create a new interview session in Firestore
      const interviewRef = await addDoc(collection(db, "interviews"), {
        userId: user.uid,
        category,
        difficulty,
        duration,
        status: "in-progress",
        createdAt: serverTimestamp(),
        questions: [], // Will be populated during the interview
        answers: [], // Will be populated during the interview
        feedback: null, // Will be populated after the interview
      })

      // Redirect to the interview session
      router.push(`/dashboard/interviews/session/${interviewRef.id}`)
    } catch (error) {
      console.error("Error starting interview:", error)
      setLoading(false)
    }
  }

  const categoryOptions = [
    { value: "frontend", label: "Frontend Development" },
    { value: "backend", label: "Backend Development" },
    { value: "dsa", label: "Data Structures & Algorithms" },
    { value: "leadership", label: "Leadership" },
    { value: "problem-solving", label: "Problem Solving" },
    { value: "communication", label: "Communication" },
    { value: "tech", label: "Tech Industry" },
    { value: "finance", label: "Finance" },
    { value: "healthcare", label: "Healthcare" },
  ]

  return (
    <div className="container py-10">
      <Link href="/dashboard" className="flex items-center text-sm text-muted-foreground mb-6 hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-6">New Interview</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Configure Your Interview</CardTitle>
          <CardDescription>Customize your interview settings to match your needs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">Interview Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Difficulty Level</Label>
            <RadioGroup value={difficulty} onValueChange={setDifficulty} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="easy" id="easy" />
                <Label htmlFor="easy" className="cursor-pointer">
                  Easy
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="cursor-pointer">
                  Medium
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hard" id="hard" />
                <Label htmlFor="hard" className="cursor-pointer">
                  Hard
                </Label>
              </div>
            </RadioGroup>
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
        </CardContent>
        <CardFooter>
          <Button onClick={handleStartInterview} disabled={loading} className="w-full">
            {loading ? "Preparing Interview..." : "Start Interview"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
