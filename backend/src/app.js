"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const analytics_routes_1 = __importDefault(require("./modules/analytics/analytics.routes"));
const env_1 = require("./config/env");
const app = (0, express_1.default)();
// Security
app.use((0, helmet_1.default)());
// CORS
app.use((0, cors_1.default)({
    origin: env_1.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));
// Logger
app.use((0, morgan_1.default)("dev"));
// Body Parsers
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Cookies
app.use((0, cookie_parser_1.default)());
// Routes
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/analytics", analytics_routes_1.default);
// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map