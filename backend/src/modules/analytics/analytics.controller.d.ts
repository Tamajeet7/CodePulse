import { Request, Response } from 'express';
export declare const AnalyticsController: {
    /**
     * GET /api/v1/analytics/repo?name=owner/repo
     * Fetches metadata and recent commits.
     */
    getRepoData(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * POST /api/v1/analytics/analyze
     * Takes repoData and commits in body, generates AI review/notes.
     */
    analyzeRepo(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=analytics.controller.d.ts.map