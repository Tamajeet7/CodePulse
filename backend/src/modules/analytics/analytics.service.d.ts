export declare const AnalyticsService: {
    /**
     * Fetches repository metadata and recent commits from GitHub public API.
     */
    fetchGithubData(repoPath: string): Promise<{
        repoData: any;
        commits: any;
    }>;
    /**
     * Generates AI Code Quality Review and Release Notes.
     * Uses Gemini if available, otherwise falls back to heuristics.
     */
    generateAISummaries(repoData: any, commits: any[]): Promise<{
        review: string;
        releaseNotes: string;
    }>;
};
//# sourceMappingURL=analytics.service.d.ts.map