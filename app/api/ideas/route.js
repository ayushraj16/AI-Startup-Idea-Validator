import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

// Initialize the Hugging Face client with your API key
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required." }, { status: 400 });
    }

    // The strict prompt instructing the model to act as an evaluator and return JSON
    const prompt = `You are an expert startup evaluator. Analyze the following startup idea.
    
    Title: ${title}
    Description: ${description}
    
    Respond ONLY with a valid, raw JSON object containing exactly these keys:
    - "problemSummary" (string)
    - "customerPersona" (string)
    - "marketOverview" (string)
    - "competitorList" (array of strings)
    - "suggestedTechStack" (array of strings)
    - "riskLevel" (string: "Low", "Medium", or "High")
    - "profitabilityScore" (number: 0-100)
    
    Do not include any explanations, greetings, or markdown formatting. Just the JSON object.`;

    // Call the Hugging Face model
    const aiResponse = await hf.chatCompletion({
      model: "meta-llama/Meta-Llama-3-8B-Instruct",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    });

    let rawOutput = aiResponse.choices[0].message.content.trim();

    // Safety check: Remove markdown JSON wrappers if the model includes them
    if (rawOutput.startsWith("```json")) {
      rawOutput = rawOutput.replace(/```json/g, "").replace(/```/g, "").trim();
    } else if (rawOutput.startsWith("```")) {
      rawOutput = rawOutput.replace(/```/g, "").trim();
    }

    // Parse the cleaned string into a JavaScript object
    const analysisReport = JSON.parse(rawOutput);

    // Send the beautiful JSON report back to your frontend!
    return NextResponse.json({ success: true, data: analysisReport }, { status: 201 });

  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate report or parse JSON." }, { status: 500 });
  }
}