import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { axiosPublic } from '../axios';
import { handleAsyncError } from '../../utils/handleAsyncError';
// import { useNavigate } from 'react-router';
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// import type { PayloadAction } from '@reduxjs/toolkit';
// import type { RootState } from '../store';


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
}

export const initialState: SongDetailsState = {
    data: null,
    dataState: "idle",
    error: null,
};



export const getSong = createAsyncThunk("homeSlice/getSong", async ({ id }: { id?: number }, { rejectWithValue }) => {
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
        const response = await axiosPublic.get("https://localhost:7086/api/Songs/getSong",
            {
                params: requestedId != null ? { songId: requestedId } : {},
            }
        );

        const result = response.data;

        //Save the returned song ID
        localStorage.setItem("ara", String(result.song.songId));
        return result;
    } catch (err) {
        return handleAsyncError("An error occurred while fetching the song", err, rejectWithValue);
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
                state.error = "null";
            })
            .addCase(getSong.fulfilled, (state, action: PayloadAction<SongDetails>) => {
                return {
                    ...state,
                    dataState: "success",
                    data: action.payload,
                    error: null
                }
            })
            .addCase(getSong.rejected, (state, action) => {
                return {
                    ...state,
                    error: (action.payload as string) ?? action.error.message ?? "Failed to fetch song."
                }
            })
    }
})

export const { } = homeSlice.actions
export default homeSlice.reducer