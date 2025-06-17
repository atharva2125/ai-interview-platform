import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc } from "firebase/firestore"

// Initialize Firebase (replace with your config)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Sample interview questions by category
const questions = {
  frontend: [
    {
      question: "Explain the difference between 'let', 'const', and 'var' in JavaScript.",
      difficulty: "easy",
    },
    {
      question: "What is the virtual DOM in React and how does it work?",
      difficulty: "medium",
    },
    {
      question: "Explain CSS specificity and how it's calculated.",
      difficulty: "medium",
    },
    {
      question: "Describe the concept of closures in JavaScript with an example.",
      difficulty: "hard",
    },
    {
      question: "What are React hooks? Explain useState and useEffect.",
      difficulty: "medium",
    },
  ],
  backend: [
    {
      question: "What is RESTful API design and what are its principles?",
      difficulty: "medium",
    },
    {
      question: "Explain the concept of middleware in Express.js or similar frameworks.",
      difficulty: "medium",
    },
    {
      question: "What is database normalization and why is it important?",
      difficulty: "hard",
    },
    {
      question: "Describe the differences between SQL and NoSQL databases.",
      difficulty: "medium",
    },
    {
      question: "What are JWT tokens and how are they used for authentication?",
      difficulty: "medium",
    },
  ],
  dsa: [
    {
      question: "Explain the time and space complexity of quicksort.",
      difficulty: "medium",
    },
    {
      question: "How would you implement a binary search tree?",
      difficulty: "hard",
    },
    {
      question: "What is dynamic programming and when would you use it?",
      difficulty: "hard",
    },
    {
      question: "Explain the difference between BFS and DFS traversal algorithms.",
      difficulty: "medium",
    },
    {
      question: "How would you detect a cycle in a linked list?",
      difficulty: "medium",
    },
  ],
  leadership: [
    {
      question: "Describe a situation where you had to lead a team through a difficult project.",
      difficulty: "medium",
    },
    {
      question: "How do you handle conflicts within your team?",
      difficulty: "medium",
    },
    {
      question: "Tell me about a time when you had to make a difficult decision as a leader.",
      difficulty: "hard",
    },
    {
      question: "How do you motivate team members who are struggling with their tasks?",
      difficulty: "medium",
    },
    {
      question: "Describe your approach to delegating tasks within a team.",
      difficulty: "easy",
    },
  ],
  "problem-solving": [
    {
      question: "Describe a complex problem you solved and your approach to solving it.",
      difficulty: "medium",
    },
    {
      question: "How do you approach troubleshooting technical issues?",
      difficulty: "medium",
    },
    {
      question: "Tell me about a time when you had to think outside the box to solve a problem.",
      difficulty: "hard",
    },
    {
      question: "How do you prioritize when dealing with multiple problems simultaneously?",
      difficulty: "medium",
    },
    {
      question: "Describe a situation where your initial solution to a problem didn't work. What did you do next?",
      difficulty: "medium",
    },
  ],
}

async function seedQuestions() {
  try {
    console.log("Starting to seed questions...")

    for (const [category, categoryQuestions] of Object.entries(questions)) {
      console.log(`Seeding ${categoryQuestions.length} questions for category: ${category}`)

      for (const q of categoryQuestions) {
        await addDoc(collection(db, "questions"), {
          category,
          question: q.question,
          difficulty: q.difficulty,
          createdAt: new Date(),
        })
      }
    }

    console.log("Successfully seeded all questions!")
  } catch (error) {
    console.error("Error seeding questions:", error)
  }
}

seedQuestions()
