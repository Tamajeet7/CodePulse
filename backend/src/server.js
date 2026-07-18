"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const env_1 = require("./config/env");
const server = http_1.default.createServer(app_1.default);
async function startServer() {
    await (0, db_1.connectDB)();
    server.listen(Number(env_1.env.PORT), () => {
        console.log(`🚀 http://localhost:${env_1.env.PORT}`);
    });
}
startServer();
//# sourceMappingURL=server.js.map