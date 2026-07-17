import axios from 'axios';
import { GoogleGenAI } from '@google/genai';
import { env } from '../../config/env';

// Initialize GenAI client if API key is present
let ai: GoogleGenAI | null = null;
if (env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
}

export const AnalyticsService = {
  /**
   * Fetches repository metadata and recent commits from GitHub public API.
   */
  async fetchGithubData(repoPath: string) {
    try {
      const cleanRepo = repoPath.replace(/https:\/\/github\.com\//, '').trim();
      
      const [repoResponse, commitsResponse] = await Promise.all([
        axios.get(`https://api.github.com/repos/${cleanRepo}`),
        axios.get(`https://api.github.com/repos/${cleanRepo}/commits?per_page=10`)
      ]);

      return {
        repoData: repoResponse.data,
        commits: commitsResponse.data
      };
    } catch (error: any) {
      console.error("Error fetching from GitHub:", error.message);
      throw new Error("Failed to fetch repository data. Ensure the repository is public and the path is correct.");
    }
  },

  /**
   * Generates AI Code Quality Review and Release Notes.
   * Uses Gemini if available, otherwise falls back to heuristics.
   */
  async generateAISummaries(repoData: any, commits: any[]) {
    // Determine categories (useful for both AI prompt context and fallback)
    const categories = {
      features: [] as string[],
      bugfixes: [] as string[],
      refactors: [] as string[],
      chores: [] as string[]
    };

    commits.forEach(c => {
      const msg = c.commit.message.split('\n')[0];
      if (msg.startsWith('feat') || msg.includes('add') || msg.includes('new')) {
        categories.features.push(msg);
      } else if (msg.startsWith('fix') || msg.includes('bug') || msg.includes('resolve')) {
        categories.bugfixes.push(msg);
      } else if (msg.startsWith('refactor') || msg.includes('optimize') || msg.includes('clean')) {
        categories.refactors.push(msg);
      } else {
        categories.chores.push(msg);
      }
    });

    // If Gemini API Key is configured, generate real AI insights!
    if (ai) {
      try {
        const commitListText = commits.map(c => `- ${c.commit.author.name}: ${c.commit.message}`).join('\n');
        
        // --- 1. Generate Code Review ---
        const reviewPrompt = `
You are a senior software engineer conducting a code review for a repository named "${repoData.name}".
Here are the recent commits:
${commitListText}

Write a short, professional "Code Quality Review" summary. 
Format it using Markdown. Include these sections:
### 🤖 AI Code Quality Review for **${repoData.name}**
#### 📈 Codebase Health Indicators (Are there too many hotfixes? Good refactoring? Mention specific things from the commits)
#### 🔍 Actionable Code Quality Advice (Give 2-3 specific, actionable advice points based on the recent changes).
Keep the tone encouraging but highly technical.`;

        const reviewResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: reviewPrompt,
        });

        // --- 2. Generate Release Notes ---
        const releasePrompt = `
You are a release manager compiling release notes for "${repoData.full_name}".
Here are the recent commits:
${commitListText}

Write a set of clean, user-facing "Release Notes".
Format it using Markdown. Include these sections:
### 📦 AI Auto-Generated Release Notes
#### 🚀 Features & Enhancements
#### 🐛 Bug Fixes & Patches
#### 🔧 Refactoring & Infrastructure
Be concise and group related items if necessary.`;

        const releaseResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: releasePrompt,
        });

        return {
          review: reviewResponse.text || "Failed to generate review text.",
          releaseNotes: releaseResponse.text || "Failed to generate release notes text."
        };
      } catch (error: any) {
        console.error("Gemini Generation Error:", error);
        // Fallback below
      }
    }

    // --- FALLBACK HEURISTICS (If no API key or AI fails) ---
    const reviewFallback = `### 🤖 Code Quality Review for **${repoData.name}**
*(Note: Generated via heuristics. Add GEMINI_API_KEY for true AI.)*

#### 📈 Codebase Health Indicators
- **High-Risk Commits Detected:** ${categories.bugfixes.length > 2 ? "⚠️ Critical concentration of quick hotfixes" : "✅ Codebase velocity appears stable."}
- **Refactoring & Optimizations:** Found **${categories.refactors.length}** code optimization initiatives.
- **Commit Frequency Index:** ${commits.length} recent changes analyzed.

---

#### 🔍 Actionable Code Quality Advice
1. **Optimize Module Declarations:** 
   ${categories.refactors.length > 0 ? `Your recent changes (e.g., *"${categories.refactors[0]}"*) improve structure.` : "No major architectural warnings detected in the analyzed scope."}
2. **Review Exception Handling:** Ensure all network queries matching API requests are guarded with robust boundary try-catch blocks.`;

    const releaseFallback = `### 📦 Auto-Generated Release Notes
*Generated based on the last ${commits.length} commits for ${repoData.full_name}*
*(Note: Generated via heuristics. Add GEMINI_API_KEY for true AI.)*

---

#### 🚀 Features & Enhancements
${categories.features.length > 0 ? categories.features.map(f => `- **New Addition:** ${f}`).join("\n") : "- No new features introduced in this commit window."}

#### 🐛 Bug Fixes & Patches
${categories.bugfixes.length > 0 ? categories.bugfixes.map(f => `- **Resolved Issue:** ${f}`).join("\n") : "- No active bugs resolved in this set."}

#### 🔧 Refactoring & Infrastructure
${categories.refactors.concat(categories.chores).length > 0 ? categories.refactors.concat(categories.chores).map(f => `- **Maintenance:** ${f}`).join("\n") : "- Clean run, no refactoring logged."}`;

    return {
      review: reviewFallback,
      releaseNotes: releaseFallback
    };
  }
};
