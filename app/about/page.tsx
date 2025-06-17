import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, Zap, BookOpen, Award } from "lucide-react"

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Link href="/" className="text-xl">
              InterviewAI
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-12">
          <Link href="/" className="flex items-center text-sm text-muted-foreground mb-6 hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>

          <h1 className="text-4xl font-bold mb-6">About InterviewAI</h1>

          <div className="grid gap-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                InterviewAI was created with a simple mission: to help job seekers practice and improve their interview
                skills in a safe, supportive environment. We believe that everyone deserves the opportunity to present
                their best self during interviews, and our AI-powered platform makes that possible.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Zap className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle>Practice Anytime</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Practice interviews whenever it's convenient for you, without scheduling or time constraints.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <BookOpen className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle>Learn & Improve</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Get detailed feedback and insights to help you improve your interview performance.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Award className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle>Build Confidence</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Gain confidence through repeated practice in a low-pressure environment.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-4">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-lg text-muted-foreground mb-6">
                    InterviewAI uses Google's Gemini AI to create realistic interview experiences tailored to your
                    needs. Our platform simulates real interview scenarios, asks relevant questions, and provides
                    constructive feedback to help you improve.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Choose from various interview types and difficulty levels</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Practice with industry-specific questions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Receive detailed feedback on your responses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Track your progress over time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Create custom interviews with your own questions</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-muted rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Our Technology</h3>
                  <p className="mb-4">InterviewAI is powered by cutting-edge technologies:</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <span className="font-medium">Google Gemini AI</span>
                        <p className="text-sm text-muted-foreground">
                          Advanced language model that creates natural, conversational interviews
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <span className="font-medium">Firebase Authentication</span>
                        <p className="text-sm text-muted-foreground">
                          Secure user authentication and account management
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <span className="font-medium">Firestore Database</span>
                        <p className="text-sm text-muted-foreground">
                          Reliable cloud storage for interview data and user progress
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <span className="font-medium">Next.js</span>
                        <p className="text-sm text-muted-foreground">
                          Fast, responsive web application for a seamless user experience
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Who We Serve</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Seekers</CardTitle>
                    <CardDescription>Preparing for upcoming interviews</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Whether you're applying for your first job or making a career change, our platform helps you
                      prepare for interviews in your target field.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Students</CardTitle>
                    <CardDescription>Building interview skills early</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Get a head start on your career by practicing interview skills before you enter the job market.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Professionals</CardTitle>
                    <CardDescription>Advancing their careers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Sharpen your interview skills for internal promotions or new opportunities at other companies.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mt-12 bg-muted p-8 rounded-lg">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Ready to improve your interview skills?</h2>
                  <p className="text-muted-foreground mb-4">
                    Join thousands of users who are mastering their interviews with InterviewAI.
                  </p>
                </div>
                <Link href="/signup">
                  <Button size="lg" className="px-8">
                    Get Started Now
                  </Button>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">© 2024 InterviewAI. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
