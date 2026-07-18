export declare class AuthService {
    static register(data: {
        name: string;
        email: string;
        password: string;
    }): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
    }>;
    static login(data: {
        email: string;
        password: string;
    }): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
    }>;
    static forgotPassword(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    static resetPassword(token: string, password: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map