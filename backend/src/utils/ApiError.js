"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, ApiError.prototype);
        Error.captureStackTrace(this);
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=ApiError.js.map