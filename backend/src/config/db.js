"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.connectDB = connectDB;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
async function connectDB() {
    try {
        await exports.prisma.$connect();
        console.log("✅ Database Connected");
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
}
//# sourceMappingURL=db.js.map