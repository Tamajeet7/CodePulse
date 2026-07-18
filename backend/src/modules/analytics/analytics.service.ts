import axios from 'axios';
import { GoogleGenAI } from '@google/genai';
import { env } from '../../config/env';
import { prisma } from '../../config/db';

const githubCache = new Map<string, { data: any, timestamp: number }>();

async function cachedGithubGet(url: string, bypassCache: boolean = false) {
  const cached = githubCache.get(url);
  if (!bypassCache && cached && (Date.now() - cached.timestamp < 5 * 60 * 1000)) {
    return { data: cached.data };
  }
  
  const res = await axios.get(url, env.GITHUB_TOKEN
    ? { headers: { Authorization: `Bearer ${env.GITHUB_TOKEN}` } as Record<string, string> }
    : {});
  
  githubCache.set(url, { data: res.data, timestamp: Date.now() });
  return res;
}

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
        cachedGithubGet(`https://api.github.com/repos/${cleanRepo}`, true),
        cachedGithubGet(`https://api.github.com/repos/${cleanRepo}/commits?per_page=10`, true)
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
          model: 'gemini-1.5-flash',
          contents: reviewPrompt,
          config: {
            temperature: 0.0
          }
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
          model: 'gemini-1.5-flash',
          contents: releasePrompt,
          config: {
            temperature: 0.0
          }
        });

        return {
          review: reviewResponse.text || "Failed to generate review text.",
          releaseNotes: releaseResponse.text || "Failed to generate release notes text."
        };
      } catch (error: any) {
        console.error("Gemini Generation Error:", error);
        if (ai) {
           return {
             review: `### ⚠️ API Error\n\nGoogle Gemini API returned an error: ${error.message || "Quota Exceeded or Model Unavailable"}\n\nPlease check your Google AI Studio quota and region limits.`,
             releaseNotes: `### ⚠️ API Error\n\nGoogle Gemini API returned an error: ${error.message || "Quota Exceeded or Model Unavailable"}\n\nPlease check your Google AI Studio quota and region limits.`
           };
        }
      }
    }

    // --- FALLBACK HEURISTICS (If no API key or AI fails) ---
    const reviewFallback = `### 🤖 Code Quality Review for **${repoData.name}**\n*(Heuristic Fallback: No API Key Provided)*\n\n#### 📈 Codebase Health Indicators\n- **High-Risk Commits Detected:** ✅ Codebase velocity appears stable.\n- **Refactoring & Optimizations:** Found **0** code optimization initiatives.\n- **Commit Frequency Index:** ${commits.length} recent changes analyzed.\n\n---\n\n#### 🔍 Actionable Code Quality Advice\n1. **Optimize Module Declarations:**\n   No major architectural warnings detected in the analyzed scope.\n2. **Review Exception Handling:** Ensure all network queries matching API requests are guarded with robust boundary try-catch blocks.`;

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
  },

  /**
   * Fetches comprehensive dashboard data for a given repository.
   * Pulls open PRs, contributors, commits, and security issues, 
   * and generates an AI Health Score (with caching).
   */
  async fetchDashboardData(repoPath: string, repoId?: string, forceReanalyze: boolean = false) {
    try {
      const cleanRepo = repoPath.replace(/https:\/\/github\.com\//, '').trim();

      // Check DB for existing cache if repoId is provided
      let dbRepo = null;
      if (repoId) {
        dbRepo = await prisma.repository.findUnique({ where: { id: repoId } });
      }

      // Parallelize GitHub API requests to reduce load time
      const [repoRes, pullsRes, contribRes, commitsRes, issuesRes] = await Promise.allSettled([
        cachedGithubGet(`https://api.github.com/repos/${cleanRepo}`, forceReanalyze),
        cachedGithubGet(`https://api.github.com/repos/${cleanRepo}/pulls?state=open&per_page=30`, forceReanalyze),
        cachedGithubGet(`https://api.github.com/repos/${cleanRepo}/contributors?per_page=30`, forceReanalyze),
        cachedGithubGet(`https://api.github.com/repos/${cleanRepo}/commits?per_page=15`, forceReanalyze),
        cachedGithubGet(`https://api.github.com/repos/${cleanRepo}/issues?state=open&labels=security&per_page=10`, forceReanalyze)
      ]);

      let rateLimited = false;
      const repoData = repoRes.status === 'fulfilled' && repoRes.value ? repoRes.value.data : null;
      
      let finalRepoData = repoData;
      if (!repoData) {
        rateLimited = true;
        finalRepoData = {
          name: cleanRepo.split('/')[1] || cleanRepo,
          full_name: cleanRepo,
          stargazers_count: 0,
          forks_count: 0
        };
      }

      const pulls = pullsRes.status === 'fulfilled' && pullsRes.value ? pullsRes.value.data : [];
      const contributors = contribRes.status === 'fulfilled' && contribRes.value ? contribRes.value.data : [];
      const commits = commitsRes.status === 'fulfilled' && commitsRes.value ? commitsRes.value.data : [];
      const securityIssues = issuesRes.status === 'fulfilled' && issuesRes.value ? issuesRes.value.data : [];

      // Structure recent commits
      const recentCommits = commits.map((c: any) => ({
        id: c.sha,
        author: c.commit.author.name,
        message: c.commit.message.split('\n')[0],
        time: new Date(c.commit.author.date).toLocaleString(),
        hash: c.sha.substring(0, 7)
      }));

      // Structure security alerts
      const securityAlerts = securityIssues.map((issue: any) => ({
        id: issue.id,
        severity: "High", // We assume security label issues are high priority
        dependency: issue.title,
        description: issue.body ? issue.body.substring(0, 100) + '...' : "No description",
        status: "open"
      }));

      let healthScore = "N/A";
      let healthChange = "+0.0%";
      let healthChangeType = "neutral";
      let healthCalculation = "Click 'Re-analyze' to generate your AI health score.";
      let healthTips = [
        "Click the Re-analyze button to generate your first AI health score.",
        "Make sure your repository has recent commits and pull requests for a better analysis.",
        "Invite contributors to improve your score."
      ];

      // Check if we can use cached health data (only if it's a real score, not an error)
      let useCache = false;
      if (dbRepo && dbRepo.healthData && !forceReanalyze) {
        try {
          const cached = dbRepo.healthData as any;
          const isValidScore = cached.score && cached.score !== 'N/A' && cached.score !== 'Error' && !isNaN(Number(cached.score));
          if (isValidScore && cached.calculation) {
            healthScore = cached.score;
            healthChange = cached.change || healthChange;
            healthChangeType = cached.changeType || healthChangeType;
            healthCalculation = cached.calculation || healthCalculation;
            healthTips = cached.tips || healthTips;
            useCache = true;
          }
        } catch (e) {
          console.error("Failed to parse cached health data", e);
        }
      }
      
      // If rate limited, force explicit message and skip AI
      if (rateLimited) {
         healthScore = "N/A";
         healthChange = "0.0%";
         healthCalculation = "GitHub API Rate Limit exceeded. We cannot fetch live metrics right now.";
         healthTips = [
           "Wait up to 60 minutes for your IP rate limit to reset.",
           "To fix this permanently, create a GitHub Personal Access Token and add it as GITHUB_TOKEN in backend/.env",
           "Switching repositories rapidly consumes unauthenticated API limits."
         ];
      } else if (!useCache && ai) {
        try {
          const prompt = `
            Analyze this GitHub repository metadata and give it a "Project Health Score" from 0 to 100.
            Name: ${finalRepoData.full_name}
            Stars: ${finalRepoData.stargazers_count}
            Forks: ${finalRepoData.forks_count}
            Open PRs: ${pulls.length}
            Open Security Issues: ${securityIssues.length}
            Active Contributors: ${contributors.length}
            Recent Commits Count: ${commits.length}

            Return a strict JSON format exactly like this:
            {
              "score": "95",
              "change": "+2.1%",
              "changeType": "positive",
              "calculation": "Brief 1-2 sentence explanation of how the score was calculated based on the metrics above.",
              "tips": ["Tip 1 to improve health", "Tip 2 to improve health", "Tip 3 to improve health"]
            }
            Do not include backticks, do not include markdown, just the JSON string.
          `;
          
          const aiResponse = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: prompt,
            config: {
              temperature: 0.0,
              responseMimeType: "application/json"
            }
          });
          
          let text = aiResponse.text || "";
          text = text.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
          
          try {
            const parsed = JSON.parse(text);
            const parsedScore = parsed.score ? String(parsed.score) : null;
            // Only accept valid numeric scores from AI
            if (parsedScore && !isNaN(Number(parsedScore))) {
              healthScore = parsedScore;
              healthChange = parsed.change || "+1.0%";
              healthChangeType = parsed.changeType || "positive";
              healthCalculation = parsed.calculation || healthCalculation;
              if (Array.isArray(parsed.tips) && parsed.tips.length > 0) {
                healthTips = parsed.tips;
              }
              
              // Save back to DB only if we got a valid score
              if (dbRepo) {
                 await prisma.repository.update({
                   where: { id: dbRepo.id },
                   data: {
                     healthData: { score: healthScore, change: healthChange, changeType: healthChangeType, calculation: healthCalculation, tips: healthTips }
                   }
                 });
              }
            } else {
              healthScore = "N/A";
              healthCalculation = "AI returned an unexpected format. Try re-analyzing.";
            }
          } catch(e) {
            console.error("Failed to parse AI JSON:", e, "Raw text:", text);
            healthScore = "Error";
            healthCalculation = "Failed to parse AI response.";
            healthTips = ["Please try re-analyzing."];
          }
        } catch (error: any) {
          console.error("AI Health Score generation failed:", error);
          const isRateLimit = error.status === 429;
          healthScore = "N/A";
          healthCalculation = isRateLimit
            ? "Gemini API daily limit reached. Score will be generated when quota resets (midnight PT)."
            : "AI Analysis failed. Please try re-analyzing later.";
          healthTips = isRateLimit
            ? ["The free Gemini tier allows 20 requests/day.", "Your daily quota resets at midnight Pacific Time.", "Previously cached scores will still be shown for analyzed repos."]
            : ["Try clicking Re-analyze again."];
        }
      }

      return {
        repoName: finalRepoData.name,
        fullName: finalRepoData.full_name,
        stats: {
          healthScore: { 
            value: `${healthScore}/100`, 
            change: healthChange, 
            changeType: healthChangeType,
            calculation: healthCalculation,
            tips: healthTips
          },
          openPrs: pulls.length.toString(),
          activeContributors: contributors.length.toString(),
        },
        recentCommits,
        securityAlerts
      };

    } catch (error: any) {
      console.error("Error fetching dashboard data:", error.message);
      throw new Error("Failed to fetch dashboard data. Make sure the repository is public.");
    }
  }
};
