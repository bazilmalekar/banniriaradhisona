import axios from "axios";

export const handleAsyncError = (message: string | undefined = "", err: unknown, rejectWithValue: Function) => {
    if (axios.isAxiosError(err) && err.response) {
        console.error(err.response.data || err.message);
        return rejectWithValue(`${message !== "" ? message + " :" : ""} ${err.message}` || "An error occurred");
    } else {
        console.error('Unexpected error:', err);
        return rejectWithValue('An unexpected error occurred');
    }
}