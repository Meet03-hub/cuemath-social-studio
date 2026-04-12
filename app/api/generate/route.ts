import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { idea, format } = await req.json();

    if (!idea) {
      return NextResponse.json(
        { error: "A rough idea is required" },
        { status: 400 }
      );
    }

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
              content: `You are a Senior Content Strategist for Cuemath, an expert in math education and learning science for parents.
              
              YOUR GOAL: 
              Turn a messy idea into a polished ${format === 'story' ? 'Instagram Story' : 'Instagram Carousel'}.
              
              STRICT BRAND VOICE:
              - Educational but simple (no jargon).
              - Empathetic towards busy parents.
              - Focused on building child confidence through math.

              STRUCTURE:
              - Slide 1: THE HOOK. Must grab attention (e.g., "Why math anxiety is contagious").
              - Slide 2-3: THE PROBLEM & SCIENCE. Explain a concept like 'The Forgetting Curve' or 'Number Sense'.
              - Slide 4-5: THE SOLUTION. Practical tips for parents.
              - Slide 6: THE CTA. Invite them to Cuemath.

              STRICT LENGTH LIMITS:
              - Title: Max 10 characters (If it's longer, it will be cut off).
              - Content: Max 140 characters (About 2 sentences).
  
              If you exceed these limits, the UI will break. Be concise and punchy.

              OUTPUT FORMAT:
              Return ONLY a JSON array with exactly 6 objects. Each object must have:
              1. "title": Short, bold heading.
              2. "content": 1-2 sentences of body text.
              3. "imageKeyword": A single word to fetch a matching background image (e.g., "brain", "child", "puzzle", "anxiety").

              Example:
              [
                { "title": "The 24-Hour Rule", "content": "Kids forget 70% of what they learn within a day. Here is why.", "imageKeyword": "clock" }
              ]`,
            },
            {
              role: "user",
              content: `Format: ${format}. Topic: ${idea}`,
            },
          ],
          temperature: 0.7,
          response_format: { type: "json_object" } // Encourages valid JSON
        }),
      }
    );

    const data = await response.json();

    if (!data.choices?.[0]?.message?.content) {
      return NextResponse.json({ error: "AI failed to respond" }, { status: 500 });
    }

    let text = data.choices[0].message.content;

    // Robust JSON Extraction
    try {
      // Find the first '[' and the last ']'
      const start = text.indexOf("[");
      const end = text.lastIndexOf("]");
      
      if (start !== -1 && end !== -1) {
        text = text.substring(start, end + 1);
      }

      const parsed = JSON.parse(text);
      
      // If the AI wrapped it in a "result" or "slides" key, extract just the array
      const finalResult = Array.isArray(parsed) ? parsed : (parsed.result || parsed.slides || []);

      return NextResponse.json({ result: finalResult });
    } catch (err) {
      console.error("Parse error. Raw text:", text);
      return NextResponse.json(
        { error: "Failed to parse AI response into a valid carousel", raw: text },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Server error occurred" },
      { status: 500 }
    );
  }
}