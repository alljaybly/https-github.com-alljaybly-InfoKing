
import { GoogleGenAI, Type } from "@google/genai";
import { AppIdea, PitchDeckSlideContent } from '../types';

// The API key is injected from the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const cleanJsonString = (str: string): string => {
  // Gemini might wrap the JSON in ```json ... ```, so we strip it.
  const match = str.match(/```json\n([\s\S]*?)\n```/);
  return match ? match[1] : str;
};


export const fetchNewIdeas = async (customTopic?: string, platforms: string[] = []): Promise<AppIdea[]> => {
  const model = "gemini-2.5-flash";
  
  const platformText = platforms.length > 0
    ? `sources like ${platforms.join(', ')}`
    : 'sources like Reddit, X (formerly Twitter), TikTok, and YouTube';

  const coreInstruction = customTopic
    ? `Based on your real-time web search of ${platformText}, provide 3 new, innovative app ideas addressing problems faced by ${customTopic}.`
    : `Based on your real-time web search of ${platformText}, provide 3 new, innovative app ideas. Focus on problems in the health, productivity, or finance sectors.`;

  const prompt = `
    You are an expert market researcher and tech analyst. Your goal is to identify genuine user problems from public web data. For each problem, brainstorm a potential app solution.

    ${coreInstruction}

    Return your response as a VALID JSON array of objects. Do not include any text, explanation, or markdown formatting outside of the JSON array itself.

    The JSON schema for each object in the array must be:
    {
      "problem": "A clear and concise description of a user problem you found.",
      "solution": "A description of a novel app that solves this specific problem.",
      "category": "Either 'Health', 'Productivity', 'Finance', or 'Other'.",
      "marketSizeScore": "A number between 0 and 100 representing the potential market size, where 100 is a billion-user potential.",
      "source": {
        "platform": "The platform where the problem was found (e.g., 'Reddit', 'X', 'Instagram', 'LinkedIn', 'YouTube'). The name should be short and capitalized.",
        "url": "A direct and valid URL to the thread, post, or video where the problem was discussed."
      }
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

export const generateAppMockup = async (idea: AppIdea): Promise<string> => {
  const model = 'imagen-3.0-generate-002';
  const prompt = `Generate a clean, simple, black and white wireframe UI mockup for a mobile app. The wireframe should be minimalist and focus on core functionality, suitable for a first concept.
  
  App Concept:
  - Problem to solve: "${idea.problem}"
  - Proposed solution: "${idea.solution}"
  
  Visualize the main screen of this application. Avoid using any color or detailed graphics.`;

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
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    } else {
      throw new Error("AI did not generate any images.");
    }
  } catch (error) {
    console.error("Error generating mockup with Gemini:", error);
    throw new Error("The AI designer is busy. Could not generate a mockup. Please try again later.");
  }
};

export const generatePitchDeckContent = async (idea: AppIdea): Promise<PitchDeckSlideContent[]> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    Generate the content for a 5-slide pitch deck for the following app idea. The goal is to be concise, impactful, and professional.

    App Idea:
    - Problem: "${idea.problem}"
    - Proposed Solution: "${idea.solution}"
    - Market Score: ${idea.marketSizeScore}/100

    Provide content for exactly 5 slides:
    1.  **Title Slide**: App Name & Tagline. The image should be an abstract logo concept.
    2.  **The Problem**: Clearly state the problem your app solves. The image should visually represent the user's frustration or the problem space.
    3.  **The Solution**: Describe your app as the clear solution. The image should be a conceptual representation of the app's main benefit or feature.
    4.  **Market Opportunity**: Briefly explain the market potential, referencing the high market score. The image should depict growth, scale, or a large user base.
    5.  **The Ask/Vision**: A concluding slide with a strong vision statement. The image should be aspirational and represent the future success of the app.

    For each slide, provide a 'title', 'content' (keep it to 2-3 short sentences), and a creative 'imagePrompt' for an AI image generator to create a compelling visual. The image prompt should be descriptive and artistic, suitable for generating a professional, visually appealing image for a pitch deck.

    Return the response as a VALID JSON array of objects, with no other text or markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              slide: { type: Type.INTEGER },
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              imagePrompt: { type: Type.STRING },
            },
            required: ["slide", "title", "content", "imagePrompt"],
          },
        },
      },
    });

    const jsonText = cleanJsonString(response.text);
    const slides: PitchDeckSlideContent[] = JSON.parse(jsonText);
    if (slides.length !== 5) {
        throw new Error("AI did not generate the required 5 slides.");
    }
    return slides;
  } catch (error) {
    console.error("Error generating pitch deck content from Gemini:", error);
    throw new Error("The AI strategist is having trouble creating the pitch deck content. Please try again.");
  }
};

export const generateSlideImage = async (prompt: string): Promise<string> => {
    const model = 'imagen-3.0-generate-002';
    const fullPrompt = `Generate a professional, minimalist, and visually appealing image for a startup pitch deck slide. The style should be modern and clean. The image should visually represent: "${prompt}"`;
    
    try {
        const response = await ai.models.generateImages({
            model,
            prompt: fullPrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg', // JPEG is smaller for PDFs
                aspectRatio: '16:9', // Standard presentation aspect ratio
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("AI did not generate any images for the slide.");
        }
    } catch (error) {
        console.error("Error generating slide image with Gemini:", error);
        throw new Error("The AI designer couldn't create a visual for the slide.");
    }
};

export const generateAppStarterCode = async (idea: AppIdea): Promise<string> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    You are a senior full-stack engineer specializing in rapid prototyping.
    Your task is to generate the starter code for a single-file React web application based on the provided app idea.

    **App Idea:**
    - **Problem:** "${idea.problem}"
    - **Solution:** "${idea.solution}"

    **Requirements:**
    1.  Use React with TypeScript.
    2.  Use Tailwind CSS for styling.
    3.  The entire application should be contained within a single \`App.tsx\` file.
    4.  Create a simple, clean, and functional UI that represents the core concept of the app idea.
    5.  Include placeholders for where API calls or more complex logic would go.
    6.  The code should be complete and ready to be pasted into a file.
    7.  Do NOT include any explanations, comments, or markdown formatting outside of the code block itself. The output should be ONLY the raw code.

    Generate the content for \`App.tsx\` now.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    // Clean potential markdown code fences
    const code = response.text.replace(/^```(tsx|typescript)\n?/, '').replace(/\n?```$/, '');
    return code;

  } catch (error) {
    console.error("Error generating starter code with Gemini:", error);
    throw new Error("The AI engineer is stuck compiling. Please try again later.");
  }
};
