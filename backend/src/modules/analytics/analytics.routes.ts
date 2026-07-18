import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';

const router = Router();

// /api/v1/analytics/repo?name=owner/repo
router.get("/repo", AnalyticsController.getRepoData);
router.get("/dashboard", AnalyticsController.getDashboardData);

// /api/v1/analytics/analyze
router.post('/analyze', AnalyticsController.analyzeRepo);

export default router;
