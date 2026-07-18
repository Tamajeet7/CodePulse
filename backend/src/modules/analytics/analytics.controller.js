"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const analytics_service_1 = require("./analytics.service");
exports.AnalyticsController = {
    /**
     * GET /api/v1/analytics/repo?name=owner/repo
     * Fetches metadata and recent commits.
     */
    async getRepoData(req, res) {
        try {
            const repoName = req.query.name;
            if (!repoName) {
                return res.status(400).json({ success: false, message: "Repository name query parameter is required." });
            }
            const data = await analytics_service_1.AnalyticsService.fetchGithubData(repoName);
            return res.status(200).json({ success: true, data });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },
    /**
     * POST /api/v1/analytics/analyze
     * Takes repoData and commits in body, generates AI review/notes.
     */
    async analyzeRepo(req, res) {
        try {
            const { repoData, commits } = req.body;
            if (!repoData || !commits || !Array.isArray(commits)) {
                return res.status(400).json({ success: false, message: "repoData and commits array are required in body." });
            }
            const summaries = await analytics_service_1.AnalyticsService.generateAISummaries(repoData, commits);
            return res.status(200).json({ success: true, data: summaries });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: error.message || "Failed to generate AI summaries." });
        }
    }
};
//# sourceMappingURL=analytics.controller.js.map