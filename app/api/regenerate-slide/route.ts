import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { currentSlide, format, topic } = await req.json();

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: `You are a Senior Content Strategist for Cuemath. 
              Your task is to REFINE a single slide for a ${format}.
              Topic of the carousel: ${topic}
              
              Current Title: ${currentSlide.title}
              Current Content: ${currentSlide.content}

              INSTRUCTIONS:
              - Make the title more punchy and the content more insightful.
              - Title: Max 10 characters.
              - Content: Max 140 characters.
              - Tone: Educational, encouraging, and parent-friendly.

              OUTPUT:
              Return ONLY a JSON object with "title" and "content".`,
            },
            {
              role: "user",
              content: `Refine this slide to be better than the current one.`,
            },
          ],
          temperature: 0.8,
          response_format: { type: "json_object" }
        }),
      }
    );

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ error: "Failed to refine slide" }, { status: 500 });
  }
}