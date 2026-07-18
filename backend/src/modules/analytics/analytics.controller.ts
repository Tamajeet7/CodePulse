import { Request, Response } from 'express';
import { AnalyticsService } from './analytics.service';

export const AnalyticsController = {
  /**
   * GET /api/v1/analytics/repo?name=owner/repo
   * Fetches metadata and recent commits.
   */
  async getRepoData(req: Request, res: Response) {
    try {
      const repoName = req.query.name as string;
      if (!repoName) {
        return res.status(400).json({ success: false, message: "Repository name query parameter is required." });
      }

      const data = await AnalyticsService.fetchGithubData(repoName);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * GET /api/v1/analytics/dashboard?repo=owner/repo
   * Fetches summarized dashboard data.
   */
  async getDashboardData(req: Request, res: Response) {
    try {
      const { repo, repoId, forceReanalyze } = req.query;
      if (!repo || typeof repo !== 'string') {
        throw new Error("Repository parameter is required");
      }
      
      const shouldReanalyze = forceReanalyze === 'true';
      const id = typeof repoId === 'string' ? repoId : undefined;

      const result = await AnalyticsService.fetchDashboardData(repo, id, shouldReanalyze);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  /**
   * POST /api/v1/analytics/analyze
   * Takes repoData and commits in body, generates AI review/notes.
   */
  async analyzeRepo(req: Request, res: Response) {
    try {
      const { repoData, commits } = req.body;
      
      if (!repoData || !commits || !Array.isArray(commits)) {
        return res.status(400).json({ success: false, message: "repoData and commits array are required in body." });
      }

      const summaries = await AnalyticsService.generateAISummaries(repoData, commits);
      return res.status(200).json({ success: true, data: summaries });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || "Failed to generate AI summaries." });
    }
  }
};
