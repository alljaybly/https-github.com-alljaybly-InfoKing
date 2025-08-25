
import React, { useState, useCallback } from 'react';
import { AppIdea, BuilderOption } from '../types';
import { generateAppStarterCode } from '../services/geminiService';
import { LoaderIcon, CodeIcon } from './icons';

interface AppBuilderModalProps {
  idea: AppIdea | null;
  onClose: () => void;
}

const AppBuilderModal: React.FC<AppBuilderModalProps> = ({ idea, onClose }) => {
  const [builder, setBuilder] = useState<BuilderOption>(BuilderOption.AI_STUDIO);
  const [output, setOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!idea) return;
    setIsLoading(true);
    setError(null);
    setOutput(null);
    setHasCopied(false);
    
    try {
      let result = '';
      switch (builder) {
        case BuilderOption.STARTER_CODE:
          result = await generateAppStarterCode(idea);
          break;
        case BuilderOption.AI_STUDIO:
          result = `You are a world-class AI engineering assistant. Create a detailed, comprehensive prompt for another AI (like Gemini or Claude) to generate the complete code for a web application based on the following idea. The final generated code should be a single-file React app using TypeScript and Tailwind CSS. The prompt should be structured to ensure the AI generates high-quality, production-ready starter code.

**App Idea:**
- **Problem:** "${idea.problem}"
- **Solution:** "${idea.solution}"

**Your generated prompt should instruct the AI to:**
1.  **Understand the Core Goal:** Reiterate the problem and solution to establish context.
2.  **Define the UI/UX:** Specify a clean, modern, and intuitive user interface. Suggest key components like a header, main content area, and specific UI elements (e.g., input fields, buttons, data displays) that are crucial for the app's function.
3.  **Component Structure:** Outline the main React components to be created within the single file (e.g., \`App\`, \`Header\`, \`FeatureComponent\`).
4.  **State Management:** Define the necessary React state variables using the \`useState\` hook to manage the application's data and UI logic.
5.  **Functionality:** Detail the core functions that need to be implemented, including user interactions (e.g., button clicks, form submissions). Include placeholders for API calls where necessary.
6.  **Styling:** Specify that Tailwind CSS should be used for all styling, and suggest some example classes to guide the aesthetic (e.g., dark mode support, color palette, font sizes).
7.  **Final Output Format:** Explicitly state that the final output must be a single block of code for an \`App.tsx\` file, with no extra explanations or markdown.

**Example structure for the prompt you should generate:**
"Generate a single-file React application (\`App.tsx\`) using TypeScript and Tailwind CSS for the following app idea.
**App Idea:** ...
**UI/UX Requirements:** ...
**Components:** ...
**State:** ...
**Functionality:** ...
**Styling:** ...
The final output should be only the raw code for the \`App.tsx\` file."`;
          break;
        case BuilderOption.REPLIT:
          result = `You are a Replit expert. Create a detailed guide for setting up a new Replit workspace to build the following app. Specify the template (e.g., React.js), necessary packages, and initial file structure.
Problem: "${idea.problem}"
Solution: "${idea.solution}"`;
          break;
      }
      setOutput(result);
    } catch (e: any) {
      setError(e.message || "Failed to generate output.");
    } finally {
      setIsLoading(false);
    }
  }, [idea, builder]);
  
  const handleCopyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const guidanceText = {
    [BuilderOption.AI_STUDIO]: "Copy this detailed prompt and paste it into Google AI Studio. It's designed to help the AI generate a complete, high-quality starter application for you.",
    [BuilderOption.REPLIT]: "Use this guide to set up your project on Replit. It outlines the best template and packages to get started quickly.",
    [BuilderOption.STARTER_CODE]: "This is a simple, single-file React application. You can copy it directly into an `App.tsx` file in your local development environment."
  };

  if (!idea) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 animate-fade-in p-4" onClick={onClose}>
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-4xl m-auto p-6 animate-slide-in flex flex-col" style={{ height: '90vh' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-3"><CodeIcon /> AI App Builder</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Generate starter code or prompts to kickstart your development.</p>
          <div className="bg-gray-100 dark:bg-gray-900/50 p-3 rounded-lg mb-4">
              <p className="font-semibold text-gray-700 dark:text-gray-200 truncate"><strong>Idea:</strong> {idea.solution}</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg text-blue-800 dark:text-blue-200 text-sm mb-4">
            <p>{guidanceText[builder]}</p>
            {builder === BuilderOption.AI_STUDIO && (
              <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="font-bold underline mt-1 inline-block">
                Open Google AI Studio
              </a>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
            <select value={builder} onChange={(e) => setBuilder(e.target.value as BuilderOption)} className="w-full sm:w-auto p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-white">
              {Object.values(BuilderOption).map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <button onClick={handleGenerate} disabled={isLoading} className="w-full sm:w-auto px-6 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">
              {isLoading ? <LoaderIcon size={20} /> : 'Generate'}
            </button>
          </div>
        </div>

        <div className="flex-grow bg-gray-900 rounded-lg p-4 overflow-y-auto relative text-white font-mono text-sm">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <LoaderIcon size={32} className="mx-auto" />
                <p className="mt-2">AI engineer is building...</p>
              </div>
            </div>
          )}
          {error && <div className="text-red-400">Error: {error}</div>}
          {output ? (
            <pre className="whitespace-pre-wrap"><code>{output}</code></pre>
          ) : !isLoading && (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Select an option and click "Generate" to see the magic.</p>
            </div>
          )}
           {output && (
             <button onClick={handleCopyToClipboard} className="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-xs">
              {hasCopied ? 'Copied!' : 'Copy'}
            </button>
           )}
        </div>
        
        <div className="flex justify-end pt-4 flex-shrink-0">
          <button onClick={onClose} className="px-6 py-2 rounded-full text-gray-700 dark:text-gray-200 bg-gray-200/50 dark:bg-gray-600/50 hover:bg-gray-300/70 dark:hover:bg-gray-500/70 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppBuilderModal;