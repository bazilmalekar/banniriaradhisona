
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { favoritesTable } from "../../db";
import { handleAsyncError } from "../../utils/handleAsyncError";

export interface Favorite {
    songId: number;
    addedAt: number;
}

export interface FavoriteSongs {
    songId: number;
    songNumber?: number;
    songTitleKa?: string;
    songTitleEn?: string;
    addedAt: number;
}

interface MarkFavouritePayload {
    songId: number;
    songNumber?: number;
    songTitleKa?: string;
    songTitleEn?: string;
}

interface FavouriteToggleResult {
    favourite: FavoriteSongs;
    isFavourite: boolean;
}

interface ApiError {
    message: string;
    errorCode: number | null;
}

interface FavouritesState {
    data: FavoriteSongs[];
    dataState: "idle" | "success" | "loading" | "failed";
    error: string | null;
    errorCode: number | null;

    favouriteSongdata: FavoriteSongs | null;
    favouriteSongdataState: "idle" | "success" | "loading" | "failed";
    favouriteSongerror: string | null;
}

const initialState: FavouritesState = {
    data: [],
    dataState: "idle",
    error: null,
    errorCode: null,

    favouriteSongdata: null,
    favouriteSongdataState: "idle",
    favouriteSongerror: null
};

// Add favourite
export const markFavourite = createAsyncThunk<FavouriteToggleResult, MarkFavouritePayload, { rejectValue: ApiError }>(
    "favourites/markFavourite",
    async ({ songId, songNumber, songTitleKa, songTitleEn }, { rejectWithValue }) => {
        try {
            const existing = await favoritesTable.get(songId);
            if (existing) {
                await favoritesTable.delete(songId);
                return {
                    favourite: existing,
                    isFavourite: false
                };
            }
            const favourite: FavoriteSongs = {
                songId,
                songNumber,
                songTitleKa,
                songTitleEn,
                addedAt: Date.now()
            };
            await favoritesTable.add(favourite);
            return {
                favourite,
                isFavourite: true
            };
        } catch (err) {
            return rejectWithValue(
                handleAsyncError("Failed to toggle favourite", err)
            );
        }
    }
);

export const fetchFavourites = createAsyncThunk<FavoriteSongs[], void, { rejectValue: ApiError }>(
    "favourites/fetchFavourites",
    async (_, { rejectWithValue }) => {
        try {
            const favourites = await favoritesTable.toArray();
            return favourites;
        } catch (err) {
            return rejectWithValue(
                handleAsyncError("Failed to fetch favourites", err)
            );
        }
    })

export const fetchFavouriteSong = createAsyncThunk<FavoriteSongs | null, { songId?: number }, { rejectValue: ApiError }>(
    "favourites/fetchFavouriteSong",
    async ({ songId }, { rejectWithValue }) => {
        try {
            const favourite = songId && await favoritesTable.get(songId);
            return favourite;
        } catch (err) {
            return rejectWithValue(
                handleAsyncError("Failed to fetch favourite song", err)
            );
        }
    })

// Remove favourite
export const removeFavourite = createAsyncThunk<
    number,
    { songId: number },
    { rejectValue: ApiError }
>(
    "favourites/removeFavourite",
    async ({ songId }, { rejectWithValue }) => {
        try {
            await favoritesTable.delete(songId);
            return songId;
        } catch (err) {
            return rejectWithValue(
                handleAsyncError("Failed to remove favourite", err)
            );
        }
    }
);

const favouritesSlice = createSlice({
    name: "favourites",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Add favourite
        builder
            .addCase(markFavourite.pending, (state) => {
                state.favouriteSongdataState = "loading";
            })
            .addCase(markFavourite.fulfilled, (state, action) => {
                const { favourite, isFavourite } = action.payload;
                if (isFavourite) {
                    const exists = state.data.some(
                        item => item.songId === favourite.songId
                    );

                    if (!exists) {
                        state.data.push(favourite);
                    }
                } else {
                    state.data = state.data.filter(
                        item => item.songId !== favourite.songId
                    );
                }

                // Update the currently selected song's favourite status
                state.favouriteSongdata = isFavourite ? favourite : null;
                state.favouriteSongdataState = "success";
            })
            .addCase(markFavourite.rejected, (state, action) => {
                state.favouriteSongdataState = "failed";
                state.error = action.payload?.message ?? "Failed to toggle favourite.";
            });

        // fetch favourite songs
        builder
            .addCase(fetchFavouriteSong.pending, (state) => {
                state.favouriteSongdataState = "loading";
                state.favouriteSongerror = null;
            })
            .addCase(fetchFavouriteSong.fulfilled, (state, action) => {
                state.favouriteSongdataState = "success";
                state.favouriteSongdata = action.payload;
                state.favouriteSongerror = null;
            })
            .addCase(fetchFavouriteSong.rejected, (state, action) => {
                state.favouriteSongdataState = "failed";
                state.favouriteSongerror = action.payload?.message ?? "Failed to fetch favourite song.";
            })

        // fetch favourite songs
        builder
            .addCase(fetchFavourites.pending, (state) => {
                state.dataState = "loading";
                state.error = null;
                state.errorCode = null;
            })
            .addCase(fetchFavourites.fulfilled, (state, action) => {
                state.dataState = "success";
                state.data = action.payload;
            })
            .addCase(fetchFavourites.rejected, (state, action) => {
                state.dataState = "failed";
                state.error = action.payload?.message ?? "Failed to fetch favourites.";
            })

        // Remove favourite
        builder
            .addCase(removeFavourite.pending, (state, action) => {
                state.data = state.data.filter(
                    item => item.songId !== action.meta.arg.songId
                );
            })
            .addCase(removeFavourite.rejected, (state, action) => {
                // Restore the removed item from the database
                // This needs a saved snapshot for a reliable rollback.
                state.error = action.payload?.message ?? "Failed to remove favourite.";
            });

    }
});

export default favouritesSlice.reducer;
