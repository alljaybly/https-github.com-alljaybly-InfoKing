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


export const fetchNewIdeas = async (customQuery?: string, platforms: string[] = ['Reddit', 'X', 'tech forums']): Promise<AppIdea[]> => {
  const model = "gemini-2.5-flash";
  const platformString = platforms.join(', ');
  const basePrompt = `
    You are an expert market researcher and tech analyst. Your goal is to identify genuine user problems from public web sources like ${platformString}. For each problem, brainstorm a potential app solution.
    Based on your real-time web search, provide 3 new, innovative app ideas. Focus on problems in the health, productivity, or finance sectors.
    `;
  
  const prompt = customQuery ? `${basePrompt}\n\nFulfill this specific user request: "${customQuery}"` : basePrompt;

  const fullPrompt = `${prompt}

    Return your response as a VALID JSON array of objects. Do not include any text, explanation, or markdown formatting outside of the JSON array itself.

    The JSON schema for each object in the array must be:
    {
      "problem": "A clear and concise description of a user problem you found.",
      "solution": "A description of a novel app that solves this specific problem.",
      "category": "Either 'Health', 'Productivity', or 'Finance'.",
      "marketSizeScore": "A number between 0 and 100 representing the potential market size, where 100 is a billion-user potential.",
      "source": {
        "url": "The direct URL to the public post, comment, or article where the problem was identified. This is mandatory for authenticity.",
        "platform": "The name of the platform (e.g., 'Reddit', 'X', 'LinkedIn')."
      }
    }
    `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
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

export const generateMockup = async (idea: AppIdea): Promise<string> => {
    const model = 'imagen-3.0-generate-002';
    const prompt = `
        A minimalist, clean, black and white UI wireframe for a mobile application.
        The app's purpose is to solve this problem: "${idea.problem}".
        The proposed solution is: "${idea.solution}".
        Focus on the main screen or a key user flow. 
        Do not include any colors or detailed text, only placeholder shapes, lines, and icons.
        The style should be a simple, high-fidelity wireframe.
    `;
    try {
        const response = await ai.models.generateImages({
            model,
            prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '9:16', // Mobile aspect ratio
            },
        });
        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        } else {
            throw new Error("Image generation failed to return an image.");
        }
    } catch (error) {
        console.error("Error generating mockup with Gemini:", error);
        throw new Error("The AI designer is on a break. Could not generate mockup.");
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

export const generatePitchDeckSlides = async (idea: AppIdea): Promise<string[]> => {
    const model = 'imagen-3.0-generate-002';

    // A helper to generate a unique, catchy app name from the solution
    const appName = idea.solution.split(' ').slice(0, 3).join(' ').replace(/[.,]/g, '');

    const slidePrompts = [
        // Slide 1: Title
        `A clean, modern, minimalist presentation slide for a pitch deck. The slide should be a TITLE slide. It must contain the title "${appName}" and a short, catchy tagline related to the solution: "${idea.solution}". Include a simple, abstract logo. Style: professional, tech startup, dark background with vibrant accent colors.`,
        // Slide 2: The Problem
        `A clean, modern, minimalist presentation slide for a pitch deck. The slide must be titled "The Problem". It should feature a single, powerful icon representing the problem, and include this text clearly: "${idea.problem}". Style: professional, tech startup, dark background with vibrant accent colors.`,
        // Slide 3: Our Solution
        `A clean, modern, minimalist presentation slide for a pitch deck. The slide must be titled "Our Solution". It should feature a simple graphic or UI element representing the app, and include this text clearly: "${idea.solution}". Style: professional, tech startup, dark background with vibrant accent colors.`,
        // Slide 4: Market Opportunity
        `A clean, modern, minimalist presentation slide for a pitch deck. The slide must be titled "Market Opportunity". It should feature a large number "${idea.marketSizeScore}/100 Potential" and a simple chart or graph icon suggesting growth. The text should also mention the target category: "${idea.category}". Style: professional, tech startup, dark background with vibrant accent colors.`,
        // Slide 5: The Vision
        `A clean, modern, minimalist presentation slide for a pitch deck. The slide must be titled "The Vision". It should feature an inspiring, forward-looking graphic (like a rocket or a globe). Include a concluding statement: "Join us in revolutionizing the ${idea.category} space." Style: professional, tech startup, dark background with vibrant accent colors.`
    ];

    try {
        const imageGenerationPromises = slidePrompts.map(prompt => 
            ai.models.generateImages({
                model,
                prompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/png',
                    aspectRatio: '16:9', // Standard presentation aspect ratio
                },
            })
        );

        const responses = await Promise.all(imageGenerationPromises);
        
        const base64Images = responses.map(response => {
            if (response.generatedImages && response.generatedImages.length > 0) {
                return response.generatedImages[0].image.imageBytes;
            }
            throw new Error("Image generation failed for one of the slides.");
        });

        return base64Images;
    } catch (error) {
        console.error("Error generating pitch deck with Gemini:", error);
        throw new Error("The AI creative director is busy. Could not generate the pitch deck.");
    }
};

export const generateAIStudioPrompt = async (idea: AppIdea): Promise<string> => {
    const model = "gemini-2.5-flash";
    const prompt = `
      You are a prompt engineering expert. Your task is to generate a comprehensive and detailed prompt that a user can copy and paste into Google AI Studio (or another advanced generative AI model) to create a full-stack web application.

      The user's app idea is:
      - Problem to solve: "${idea.problem}"
      - Proposed solution: "${idea.solution}"
      - Category: "${idea.category}"

      Generate a single, complete prompt. The prompt should instruct the AI to:
      1.  **Choose a Tech Stack**: Recommend a modern, full-stack tech stack suitable for this application (e.g., React with TypeScript for the frontend, Node.js/Express for the backend, and Firebase/Supabase/PostgreSQL for the database and authentication). Justify the choice briefly.
      2.  **Define the Database Schema**: Outline the necessary database tables, columns, and relationships.
      3.  **Plan the API Endpoints**: List the key RESTful API endpoints required for the application's functionality.
      4.  **Structure the Frontend**: Describe the component hierarchy for the React frontend.
      5.  **Generate the Code**: Request the AI to generate the complete, production-ready code for all files, including detailed comments.
      6.  **Include Setup Instructions**: Ask for a step-by-step guide on how to set up the project, install dependencies, and run it locally.

      Format the entire output as a single block of text that is ready to be copied. Do not wrap it in markdown.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating AI Studio prompt with Gemini:", error);
        throw new Error("The AI prompt engineer is on a break. Could not generate the build prompt.");
    }
};