"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    success;
    message;
    data;
    constructor(success, message, data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
    static success(message, data) {
        return new ApiResponse(true, message, data);
    }
    static error(message) {
        return new ApiResponse(false, message);
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=ApiResponse.js.map