"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = require("./analytics.controller");
const router = (0, express_1.Router)();
// /api/v1/analytics/repo?name=owner/repo
router.get('/repo', analytics_controller_1.AnalyticsController.getRepoData);
// /api/v1/analytics/analyze
router.post('/analyze', analytics_controller_1.AnalyticsController.analyzeRepo);
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map