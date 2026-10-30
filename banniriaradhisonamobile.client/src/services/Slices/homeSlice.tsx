import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { axiosPublic } from '../axios';
// import { handleAsyncError } from '../../utils/handleAsyncError';
import axios from 'axios';

export interface Song {
    songId: number;
    songNumber: number;
    songScale: string | null;
    songTitleEn: string;
    songTitleKa: string;
    songLyr: string;
    audioKey: string | null;
    audioFile: File | null;
    createdDate: string;
    updateDate: string | null;
    removeExistingAudio: boolean;
}

export interface SongDetails {
    song: Song;
    songCount: number;
    audioUrl: string | null;
}


export interface SongDetailsState {
    data: SongDetails | null;
    dataState: "idle" | "success" | "loading" | "failed";
    error: string | null;
    errorCode: number | null;
}

interface ApiError {
    message: string;
    errorCode: number | null;
}

export const initialState: SongDetailsState = {
    data: null,
    dataState: "idle",
    error: null,
    errorCode: null
};

export const getSong = createAsyncThunk<
    SongDetails,
    { id?: number },
    { rejectValue: ApiError }
>("homeSlice/getSong", async ({ id }: { id?: number }, { rejectWithValue }) => {
    try {
        //Read the saved song ID
        const localId = localStorage.getItem("ara");
        const savedId = localId ? Number(localId) : NaN;

        //Determine which ID to fetch
        const requestedId =
            id != null && Number.isInteger(id) && id > 0
                ? id
                : Number.isInteger(savedId) && savedId > 0
                    ? savedId
                    : undefined;

        //Fetch the song
        const response = await axiosPublic.get("/api/Songs/getSong",
            {
                params: requestedId != null ? { songId: requestedId } : {},
            }
        );
        const result = response.data;
        //Save the returned song ID
        localStorage.setItem("ara", String(result.song.songId));
        return result;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            return rejectWithValue({
                message: err.response
                    ? `API request failed: ${err.response.status}`
                    : err.request
                        ? "No response from the server. Please check your internet connection and try again."
                        : err.message,
                errorCode: err.response?.status ?? 0,
            });
        }

        return rejectWithValue({
            message: err instanceof Error ? err.message : "An unexpected error occurred.",
            errorCode: null,
        });
    }
});

export const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSong.pending, (state) => {
                state.dataState = "loading";
                state.error = null;
                state.errorCode = null;
            })
            .addCase(getSong.fulfilled, (state, action) => {
                return {
                    ...state,
                    dataState: "success",
                    data: action.payload,
                    error: null,
                    errorCode: null,
                }
            })
            .addCase(getSong.rejected, (state, action) => {
                state.dataState = "failed";
                state.error =
                    action.payload?.message ??
                    action.error.message ??
                    "Failed to fetch song.";
                state.errorCode = action.payload?.errorCode ?? null;
            });
    }

})

export const { } = homeSlice.actions
export default homeSlice.reducer