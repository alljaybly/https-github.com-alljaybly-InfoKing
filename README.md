# InfoKing 👑

**Find your next billion-user app idea.**

InfoKing is an AI-powered web app that scrapes public web data for user problems and generates potential billion-user app ideas. It's a comprehensive toolkit for entrepreneurs, featuring an AI analyst, mockup generator, pitch deck creator, and more, all within a gamified and intuitive UI.

![InfoKing Screenshot](https://placehold.co/1200x600/22d3ee/FFFFFF/png?text=InfoKing+UI)
*(A screenshot of the main interface would go here)*

## Core Concept

The hardest part of starting a new venture is finding a validated problem to solve. InfoKing automates this discovery process by using Google's Gemini AI to scan real-time conversations on platforms like Reddit, X (Twitter), YouTube, and TikTok. It identifies genuine user pain points and brainstorms innovative app-based solutions, giving you a head start in building the next big thing.

## Key Features

InfoKing is more than just an idea generator; it's a suite of AI-powered tools to take you from concept to code.

-   **🚀 AI Idea Generation**: Scrapes the web for user problems and generates unique app ideas.
    -   Select specific platforms to search (Reddit, X, YouTube, etc.).
    -   Search for ideas on a custom topic (e.g., "health apps for remote workers").
    -   Use **voice commands** to initiate a search.
-   **🤖 AI Analyst (Brainstorm Bot)**: Get a deep-dive analysis of any idea, including:
    -   Full SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis.
    -   Key feature suggestions for a Minimum Viable Product (MVP).
    -   A "Global Winner Verdict" on its billion-user potential.
-   **🎨 AI Mockup Generator**: Instantly generate a clean, black-and-white UI wireframe for any app idea to visualize the concept.
-   **📊 AI Pitch Deck Creator**: Generate a professional 5-slide pitch deck complete with:
    -   Concise, impactful text for each slide (Problem, Solution, Market, etc.).
    -   Unique, AI-generated images for each slide's theme.
    -   **Downloadable PDF** for investor meetings.
-   **💻 AI App Builder**: Kickstart your development with:
    -   Ready-to-use **React starter code**.
    -   Detailed prompts for **Google AI Studio**.
    -   Setup guides for **Replit**.
-   **🏆 App Showcase**: Explore a gallery of apps built by the InfoKing community and **submit your own app** to get featured.
-   **💬 Community Forum**: Discuss ideas, get feedback, ask questions, and collaborate with other founders.
-   **⚙️ Modern UI/UX**:
    -   Sleek, responsive design with **Dark Mode**.
    -   Gamified interface with confetti and smooth animations.
    -   **Offline support** via localStorage, so you never lose your ideas.
    -   Intuitive sorting and history view.

## Tech Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **AI**: Google Gemini API (`gemini-2.5-flash` for text, `imagen-3.0-generate-002` for images)
-   **PDF Generation**: jsPDF
-   **Offline Storage**: Browser localStorage (simulating a Supabase backend)
-   **Bundler/Dev Environment**: Assumes Vite or similar modern setup.

## Getting Started

To run this project, you need a local development environment that can handle React, TypeScript, and module imports.

### Prerequisites

-   A modern web browser.
-   A local web server (e.g., the `Live Server` extension for VS Code).
-   A Google Gemini API key. You can get one from [Google AI Studio](https://aistudio.google.com/).

### Setup

1.  **Download the project files.**

2.  **Set up the API Key:** The application requires your Google Gemini API key to be available as an environment variable named `API_KEY`. The code accesses this key via `process.env.API_KEY`. You must configure this variable in the environment where you deploy or run the application. The app will not function without it.

3.  **Serve the `index.html` file** from your local web server. The app should load and be ready to use.

## How to Use InfoKing

1.  **Discover**: Use the "Find New Ideas" button, specify a topic, or use the voice assistant to generate new app ideas.
2.  **Analyze**: Click "Brainstorm" on any idea card to get a detailed AI analysis.
3.  **Visualize**: Click "Mockup" to see a basic wireframe of the app.
4.  **Build**: Click "Build App" to get starter code or prompts for other AI tools.
5.  **Pitch**: Click "Pitch Deck" to create a downloadable PDF presentation.
6.  **Share & Discuss**: Post your ideas on the "Forum" or, once built, submit your project to the "Apps" showcase.

## Contributing

Contributions are welcome! If you have suggestions or want to improve the app, please feel free to fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.
