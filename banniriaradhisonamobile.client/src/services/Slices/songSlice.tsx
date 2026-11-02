
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPublic } from "../axios";
import axios from "axios";

export interface SongListItem {
    songId: number;
    songCount: number;
    songTitle: string;
    songTitleEn: string;
}

export interface SongState {
    songs: SongListItem[];
    dataState: "idle" | "success" | "loading" | "failed";
    error: string | null;
    errorCode: number | null;
}

interface ApiError {
    message: string;
    errorCode: number | null;
}

export const initialState: SongState = {
    songs: [],
    dataState: "idle",
    error: null,
    errorCode: null
};

export const getAllSongs = createAsyncThunk<
    SongListItem[],
    void,
    { rejectValue: ApiError }
>("songSlice/getAllSongs", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosPublic.get<SongListItem[]>("/api/Songs/getallsongs");
        return response.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            return rejectWithValue({
                message: err.response
                    ? `API request failed: ${err.response.status}`
                    : err.request
                        ? "Unable to connect to the server. Please check your network connection and try again."
                        : err.message,
                errorCode: err.response?.status ?? 0
            });
        }
        return rejectWithValue({
            message: err instanceof Error
                ? err.message
                : "An unexpected error occurred.",
            errorCode: null
        });
    }
}
);

// Songs slice
export const songSlice = createSlice({
    name: "songSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllSongs.pending, (state) => {
                state.dataState = "loading";
                state.error = null;
                state.errorCode = null;
            })
            .addCase(getAllSongs.fulfilled, (state, action) => {
                return {
                    ...state,
                    dataState: "success",
                    songs: action.payload,
                    error: null,
                    errorCode: null
                }
            })
            .addCase(getAllSongs.rejected, (state, action) => {
                state.dataState = "failed";
                state.error =
                    action.payload?.message ??
                    action.error.message ??
                    "Failed to fetch songs.";
                state.errorCode = action.payload?.errorCode ?? null;
            });
    }
});

export default songSlice.reducer;
