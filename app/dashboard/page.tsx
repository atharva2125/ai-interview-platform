"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Play, Plus, Target, Trophy } from "lucide-react"

export default function Dashboard() {
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser
        if (!user) return

        const userDocRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          setUserData({ id: userDoc.id, ...userDoc.data() })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (loading) {
    return (
      <div className="container py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/3 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Welcome, {userData?.name?.split(" ")[0] || "User"}</h1>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Interviews Completed</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-3xl font-bold">{userData?.interviewsCompleted || 0}</div>
              <Trophy className="h-6 w-6 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-3xl font-bold">{userData?.averageScore ? `${userData.averageScore}%` : "N/A"}</div>
              <Target className="h-6 w-6 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Next Interview</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-sm font-medium">
                {userData?.nextInterview ? new Date(userData.nextInterview).toLocaleDateString() : "None scheduled"}
              </div>
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Interviews</CardTitle>
              <CardDescription>Your interview history and performance</CardDescription>
            </CardHeader>
            <CardContent>
              {userData?.interviewsCompleted > 0 ? (
                <div className="space-y-4">
                  {/* This would be populated with actual interview data from Firestore */}
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">Frontend Developer Interview</p>
                      <p className="text-sm text-muted-foreground">React, TypeScript, CSS</p>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">3 days ago</span>
                    </div>
                    <div className="text-sm font-medium">
                      Score: <span className="text-green-500">85%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <Play className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No interviews yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start your first interview to see your performance here
                  </p>
                  <Link href="/dashboard/interviews/new">
                    <Button>
                      <Play className="mr-2 h-4 w-4" />
                      Start Interview
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Start a new interview or view resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link href="/dashboard/interviews/new">
                  <Button className="w-full justify-start">
                    <Play className="mr-2 h-4 w-4" />
                    Start New Interview
                  </Button>
                </Link>
                <Link href="/dashboard/interviews/custom">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Custom Interview
                  </Button>
                </Link>
                <Link href="/dashboard/progress">
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="mr-2 h-4 w-4" />
                    View Progress
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="technical">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Practice Categories</h2>
            <TabsList>
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
              <TabsTrigger value="industry">Industry</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="technical" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Frontend Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">React, Angular, Vue, HTML, CSS, JavaScript</p>
                  <Link href="/dashboard/interviews/new?category=frontend">
                    <Button variant="outline" size="sm">
                      Start Practice
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Backend Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Node.js, Python, Java, Databases, APIs</p>
                  <Link href="/dashboard/interviews/new?category=backend">
                    <Button variant="outline" size="sm">
                      Start Practice
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Data Structures & Algorithms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Arrays, Linked Lists, Trees, Sorting, Dynamic Programming
                  </p>
                  <Link href="/dashboard/interviews/new?category=dsa">
                    <Button variant="outline" size="sm">
                      Start Practice
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="behavioral" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Leadership</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Team management, conflict resolution, decision making
                  </p>
                  <Link href="/dashboard/interviews/new?category=leadership">
                    <Button variant="outline" size="sm">
                      Start Practice
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Problem Solving</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Critical thinking, analytical skills, creativity</p>
                  <Link href="/dashboard/interviews/new?category=problem-solving">
                    <Button variant="outline" size="sm">
                      Start Practice
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Communication</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Verbal skills, presentation, collaboration</p>
                  <Link href="/dashboard/interviews/new?category=communication">
                    <Button variant="outline" size="sm">
                      Start Practice
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="industry" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Tech Industry</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Software companies, startups, enterprise</p>
                  <Link href="/dashboard/interviews/new?category=tech">
                    <Button variant="outline" size="sm">
                      Start Practice
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Finance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Banking, investment, fintech</p>
                  <Link href="/dashboard/interviews/new?category=finance">
                    <Button variant="outline" size="sm">
                      Start Practice
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Healthcare</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Medical, biotech, health IT</p>
                  <Link href="/dashboard/interviews/new?category=healthcare">
                    <Button variant="outline" size="sm">
                      Start Practice
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
