
import { GoogleGenAI, Type } from "@google/genai";
import { AppIdea } from '../types';

// Note: Your API key must be available as an environment variable `process.env.API_KEY`
// Do not hardcode the API key in the code.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might have better error handling,
  // but for this hackathon, we'll alert the user.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const cleanJsonString = (str: string): string => {
  // Gemini might wrap the JSON in ```json ... ```, so we strip it.
  const match = str.match(/```json\n([\s\S]*?)\n```/);
  return match ? match[1] : str;
};


export const fetchNewIdeas = async (): Promise<AppIdea[]> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    You are an expert market researcher and tech analyst. Your goal is to identify genuine user problems from public web sources like Reddit, X (formerly Twitter), and tech forums. For each problem, brainstorm a potential app solution.

    Based on your real-time web search, provide 3 new, innovative app ideas. Focus on problems in the health, productivity, or finance sectors.

    Return your response as a VALID JSON array of objects. Do not include any text, explanation, or markdown formatting outside of the JSON array itself.

    The JSON schema for each object in the array must be:
    {
      "problem": "A clear and concise description of a user problem you found.",
      "solution": "A description of a novel app that solves this specific problem.",
      "category": "Either 'Health', 'Productivity', or 'Finance'.",
      "marketSizeScore": "A number between 0 and 100 representing the potential market size, where 100 is a billion-user potential."
    }
    `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        // Use Google Search for real-time information grounding
        tools: [{ googleSearch: {} }],
      },
    });

    const jsonText = cleanJsonString(response.text);
    
    // The response is a string that we need to parse.
    const parsedIdeas: Omit<AppIdea, 'id'>[] = JSON.parse(jsonText);

    // Add a unique ID to each idea
    const ideasWithIds: AppIdea[] = parsedIdeas.map(idea => ({
      ...idea,
      id: self.crypto.randomUUID(),
      // Ensure score is a number, as Gemini might return it as a string
      marketSizeScore: Number(idea.marketSizeScore) || 0,
    }));
    
    return ideasWithIds;

  } catch (error) {
    console.error("Error fetching or parsing ideas from Gemini:", error);
    // Provide a more user-friendly error message
    throw new Error("The AI is sleeping on the job! Could not generate new ideas. Please check your API key and try again.");
  }
};

export const brainstormIdea = async (idea: AppIdea): Promise<string> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    You are a world-class venture capitalist and startup strategist. Analyze the following app idea and provide a concise, actionable analysis.

    App Idea:
    - Problem: "${idea.problem}"
    - Proposed Solution: "${idea.solution}"

    Your analysis must include the following sections, formatted clearly with Markdown:

    1.  **SWOT Analysis**:
        *   **Strengths**: What are the inherent advantages of this idea?
        *   **Weaknesses**: What are the potential vulnerabilities or challenges?
        *   **Opportunities**: What external factors or market trends could this app leverage?
        *   **Threats**: Who are the main competitors? What market or technology shifts could threaten this idea?

    2.  **Key Feature Suggestions (MVP)**:
        *   List the top 3-5 essential features needed for a minimum viable product.

    3.  **Global Winner Verdict**:
        *   Provide a final summary. Does this idea have the potential to be a "global winner" (1B+ users)? Why or why not? Be realistic and critical.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error brainstorming idea with Gemini:", error);
        throw new Error("The AI analyst is on a coffee break. Please try again later.");
    }
};
