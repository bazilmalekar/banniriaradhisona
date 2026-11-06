import axios from "axios";

export interface ApiError {
    message: string;
    errorCode: number | null;
}

export const handleAsyncError = (
    message: string,
    err: unknown
): ApiError => {
    if (axios.isAxiosError(err)) {
        return {
            message: `${message}: ${err.message}`,
            errorCode: err.response?.status ?? 0
        };
    }

    return {
        message: err instanceof Error
            ? `${message}: ${err.message}`
            : `${message}: An unexpected error occurred.`,
        errorCode: null
    };
};