import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "")

// Get the model
export const getGeminiModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
}

// Generate a response from Gemini
export async function generateInterviewResponse(prompt: string, history: any[] = []) {
  try {
    const model = getGeminiModel()

    const chat = model.startChat({
      history: history.map((msg) => ({
        role: msg.role === "assistant" ? "model" : msg.role,
        parts: [{ text: msg.content }],
      })),
    })

    const result = await chat.sendMessage(prompt)
    const response = await result.response
    const text = response.text()

    return { text, success: true }
  } catch (error) {
    console.error("Error generating interview response:", error)
    return {
      text: "Sorry, I encountered an error while processing your response. Please try again.",
      success: false,
    }
  }
}

// ... existing code ...
