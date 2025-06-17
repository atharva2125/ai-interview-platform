"use client"

import { useState, useEffect } from "react"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, TrendingUp, Calendar } from "lucide-react"

export default function Progress() {
  const [interviews, setInterviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    categoryBreakdown: {} as Record<string, number>,
    recentScores: [] as number[],
  })

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const user = auth.currentUser
        if (!user) return

        const interviewsQuery = query(
          collection(db, "interviews"),
          where("userId", "==", user.uid),
          where("status", "==", "completed"),
          orderBy("completedAt", "desc"),
        )

        const interviewsSnapshot = await getDocs(interviewsQuery)
        const interviewsList: any[] = []
        let totalScore = 0
        let scoreCount = 0
        const categoryBreakdown: Record<string, number> = {}
        const recentScores: number[] = []

        interviewsSnapshot.forEach((doc) => {
          const interviewData = { id: doc.id, ...doc.data() }
          interviewsList.push(interviewData)

          // Extract score from feedback if available
          if (interviewData.feedback) {
            const scoreMatch = interviewData.feedback.match(/(\d+)(?:\s*\/\s*|\s+out\s+of\s+)100/i)
            if (scoreMatch) {
              const score = Number.parseInt(scoreMatch[1])
              totalScore += score
              scoreCount++

              // Add to recent scores (last 5)
              if (recentScores.length < 5) {
                recentScores.push(score)
              }

              // Update category breakdown
              const category = interviewData.category
              if (category) {
                categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1
              }
            }
          }
        })

        setInterviews(interviewsList)
        setStats({
          totalInterviews: interviewsList.length,
          averageScore: scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0,
          categoryBreakdown,
          recentScores,
        })
      } catch (err) {
        console.error("Error fetching interviews:", err)
        setError("Failed to load your progress data")
      } finally {
        setLoading(false)
      }
    }

    fetchInterviews()
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
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
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Your Progress</h1>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-3xl font-bold">{stats.totalInterviews}</div>
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className={`text-3xl font-bold ${getScoreColor(stats.averageScore)}`}>
                {stats.averageScore > 0 ? `${stats.averageScore}%` : "N/A"}
              </div>
              <TrendingUp className="h-6 w-6 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Most Practiced Category</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(stats.categoryBreakdown).length > 0 ? (
                <div className="text-lg font-medium capitalize">
                  {Object.entries(stats.categoryBreakdown).sort((a, b) => b[1] - a[1])[0][0]}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No data available</div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="history">
          <TabsList>
            <TabsTrigger value="history">Interview History</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="trends">Score Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Interviews</CardTitle>
                <CardDescription>Your interview history and performance</CardDescription>
              </CardHeader>
              <CardContent>
                {interviews.length > 0 ? (
                  <div className="space-y-4">
                    {interviews.map((interview) => {
                      // Extract score from feedback
                      let score = 0
                      if (interview.feedback) {
                        const scoreMatch = interview.feedback.match(/(\d+)(?:\s*\/\s*|\s+out\s+of\s+)100/i)
                        if (scoreMatch) {
                          score = Number.parseInt(scoreMatch[1])
                        }
                      }

                      return (
                        <div key={interview.id} className="flex items-center justify-between border-b pb-4">
                          <div>
                            <p className="font-medium capitalize">{interview.category} Interview</p>
                            <p className="text-sm text-muted-foreground">
                              {interview.difficulty.charAt(0).toUpperCase() + interview.difficulty.slice(1)} Level
                            </p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {interview.completedAt?.toDate().toLocaleDateString()}
                          </div>
                          <div className={`text-sm font-medium ${getScoreColor(score)}`}>
                            Score: {score > 0 ? `${score}%` : "N/A"}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">No interview history available</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>Distribution of your interview practice</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(stats.categoryBreakdown).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(stats.categoryBreakdown).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <div className="capitalize">{category}</div>
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 h-2 w-32 rounded-full overflow-hidden">
                            <div
                              className="bg-primary h-full"
                              style={{ width: `${(count / stats.totalInterviews) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-sm font-medium">{count}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">No category data available</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Score Trends</CardTitle>
                <CardDescription>Your performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.recentScores.length > 0 ? (
                  <div className="h-64 flex items-end justify-between gap-2">
                    {stats.recentScores.map((score, index) => (
                      <div key={index} className="flex flex-col items-center gap-2 flex-1">
                        <div
                          className={`w-full rounded-t-md ${getScoreColor(score).replace("text-", "bg-")}`}
                          style={{ height: `${score}%` }}
                        ></div>
                        <div className={`text-sm font-medium ${getScoreColor(score)}`}>{score}%</div>
                        <div className="text-xs text-muted-foreground">#{stats.recentScores.length - index}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">No score data available</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
