export declare class ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T | undefined;
    constructor(success: boolean, message: string, data?: T | undefined);
    static success<T>(message: string, data?: T): ApiResponse<T>;
    static error(message: string): ApiResponse<unknown>;
}
//# sourceMappingURL=ApiResponse.d.ts.map