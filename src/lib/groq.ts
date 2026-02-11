import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const MODEL = "llama-3.3-70b-versatile";

export async function chatWithAI(message: string, history: { role: string; content: string }[] = []) {
  const response = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "You are an expert AI career coach. Provide helpful, actionable career advice in plain text format. Do not use markdown, asterisks, or special formatting. Write in clear paragraphs with proper spacing." },
      ...history.map(h => ({ role: h.role as "user" | "assistant", content: h.content })),
      { role: "user", content: message },
    ],
    model: MODEL,
    temperature: 0.7,
    max_tokens: 1024,
  });

  return response.choices[0]?.message?.content || "";
}

export async function analyzeResume(resumeText: string) {
  const prompt = `Analyze resume and provide improvement insights. Return JSON:
{"overallScore":75,"categories":{"contactInfo":{"score":80,"feedback":"Add LinkedIn profile and portfolio link"},"experience":{"score":70,"feedback":"Quantify achievements with metrics and numbers"},"education":{"score":75,"feedback":"Include relevant coursework and GPA if strong"},"skills":{"score":80,"feedback":"Add more technical skills and certifications"}},"summary":"Strong foundation but needs quantifiable achievements and better formatting"}

Resume: ${resumeText.slice(0, 1000)}`;

  const response = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: MODEL,
    temperature: 0.3,
    max_tokens: 512,
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0]?.message?.content || "{}");
}

export async function generateCoverLetter(jobTitle: string, company: string, userInfo?: string) {
  const prompt = `Generate a professional cover letter for a ${jobTitle} position at ${company}.
${userInfo ? `User background: ${userInfo}` : ""}
Make it compelling, professional, and tailored to the role.`;

  const response = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: MODEL,
    temperature: 0.7,
    max_tokens: 1024,
  });

  return response.choices[0]?.message?.content || "";
}

export async function generateRoadmap(position: string, type: "linear" | "branching" = "linear") {
  const isBranching = type === "branching";

  const prompt = isBranching
    ? `Create a detailed branching learning roadmap for a ${position}. Return ONLY valid JSON, no markdown. 
      The roadmap MUST be non-linear and have multiple branches. Do not just create a straight line.
      Structure:
      {
        "nodes": [
          {"id": "1", "label": "Fundamentals", "description": "Core concepts"}
        ],
        "edges": [
          {"source": "1", "target": "2", "label": "Next step"}
        ]
      }
      Requirements:
      - Start with 1 core node.
      - IMMEDIATELY branch into 2-3 parallel paths (e.g., Frontend vs Backend vs DevOps).
      - Merge paths where relevant.
      - At least 10-12 nodes.
      - At least 3-4 split points where one node connects to multiple future nodes.`
    : `Create a linear learning roadmap for ${position}. Return ONLY valid JSON array, no markdown:
      [
        {"title": "text", "description": "text", "duration": "text"}
      ]
      Include 6-8 milestones.`;

  const response = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: MODEL,
    temperature: 0.5,
    max_tokens: 2048,
    response_format: { type: "json_object" }
  });

  const content = response.choices[0]?.message?.content || (isBranching ? "{\"nodes\":[], \"edges\":[]}" : "{\"roadmap\":[]}");
  const cleaned = content.replace(/```json\n?|```\n?/g, '').trim();
  const parsed = JSON.parse(cleaned);

  if (isBranching) {
    return parsed;
  } else {
    // Standardize linear output to match what UI expects or return as is if the UI handles it
    // The previous implementation returned an array. Let's keep it consistent or standardize to nodes/edges?
    // For now, let's return the array for linear to maintain backward compatibility if needed, 
    // OR converting linear to nodes/edges here would be cleaner for the UI.
    // Let's return the raw array for linear and handle logic in UI, or returning a standardized object.
    // The UI currently expects an array for the linear logic.
    return parsed.roadmap || parsed;
  }
}
