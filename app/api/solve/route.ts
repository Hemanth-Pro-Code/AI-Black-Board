import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "GROQ_API_KEY is not configured in the server environment. Please add GROQ_API_KEY in your deployment environment variables (Vercel / Render).",
        },
        { status: 500 }
      );
    }

    const { prompt } = await request.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Prompt is required.",
        },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-120b",
      temperature: 0.3,
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content: `
You are an AI Smart Board Assistant.

The input comes from OCR of handwritten content on a smart board.

Rules:

- Use the OCR text exactly as written whenever possible.
- Only correct OCR mistakes if the text is clearly unreadable.
- Never invent words, equations, numbers or facts.

If the input is:
• A question → Answer it.
• A math problem → Solve it step by step.
• A programming question → Explain and provide examples.
• A science question → Explain clearly.
• Notes → Summarize or expand them.

Always answer naturally like ChatGPT.

Format your response as classroom notes.

End naturally.
`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      answer:
        completion.choices[0]?.message?.content ??
        "No response generated.",
    });
  } catch (error: unknown) {
    console.error("GROQ ERROR:", error);
    const message =
      error instanceof Error ? error.message : "Groq request failed.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}