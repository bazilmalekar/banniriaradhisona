import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleAsyncError } from "../../utils/handleAsyncError";
import { playlistsTable } from "../../db";

export interface PlaylistSong {
    playlistId: string;
    songId: number;
    songTitleEn?: string;
    songTitleKa?: string;
    sortOrder: number;
    addedAt: number;
}

export interface Playlist {
    playlistId: string;
    playlistName: string;
    userId?: string | null;
    colorKey: string;
    createdAt?: number;
    updatedAt?: number;
}

export interface PlaylistShare {
    shareId: string;
    playlistId: string;
    shareTokenHash: string;
    createdAt: number;
    expiresAt?: number | null;
    revokedAt?: number | null;
}

export interface PlaylistEdit {
    playlistId: string;
    playlistName: string;
    colorKey: string;
}

interface ApiError {
    message: string;
    errorCode: number | null;
}

export interface IinitialState {
    CreatePlaylistDataState: "idle" | "success" | "loading" | "failed";
    CreatePlaylistDataError: String | null,

    PlaylistData: Playlist[];
    PlaylistDataState: "idle" | "success" | "loading" | "failed";
    PlaylistDataError: String | null;

    DeletePlaylistStatus: "idle" | "success" | "loading" | "failed";
    DeletePlaylistError: String | null;

    PlaylistSong: PlaylistSong[];
    PlaylistSongState: "idle" | "success" | "loading" | "failed";
    PlaylistSongError: String | null;

    EditPlaylistStatus: "idle" | "success" | "loading" | "failed";
    EditPlaylistError: string | null;
}

const initialState: IinitialState = {
    CreatePlaylistDataState: "idle",
    CreatePlaylistDataError: null,

    PlaylistData: [],
    PlaylistDataState: "idle",
    PlaylistDataError: null,

    DeletePlaylistStatus: "idle",
    DeletePlaylistError: null,

    PlaylistSong: [],
    PlaylistSongState: "idle",
    PlaylistSongError: null,

    EditPlaylistStatus: "idle",
    EditPlaylistError: null,
}

export const getPlaylist = createAsyncThunk<
    Playlist[],
    void,
    { rejectValue: ApiError }
>(
    "playlistSlice/getPlaylist",
    async (_, { rejectWithValue }) => {
        try {
            const playlists = await playlistsTable.toArray();
            return playlists;
        } catch (err) {
            return rejectWithValue(
                handleAsyncError("Failed to fetch playlists", err)
            );
        }
    }
);

export const createPlaylist = createAsyncThunk<
    Playlist,
    Playlist,
    { rejectValue: ApiError }
>(
    "playlistSlice/createPlaylist",
    async ({ playlistId, playlistName, userId, colorKey }, { rejectWithValue }) => {
        try {
            const now = Date.now();
            const playlist: Playlist = {
                playlistId,
                playlistName,
                userId,
                colorKey,
                createdAt: now,
                updatedAt: now
            };
            await playlistsTable.add(playlist);
            return playlist;
        } catch (err) {
            return rejectWithValue(
                handleAsyncError("Failed to create playlist", err)
            );
        }
    }
);

export const deletePlaylist = createAsyncThunk<
    string,
    { playlistId: string },
    { rejectValue: ApiError }
>(
    "playlistSlice/deletePlaylist",
    async ({ playlistId }, { rejectWithValue }) => {
        try {
            await playlistsTable.delete(playlistId);
            return playlistId;
        } catch (err) {
            return rejectWithValue(
                handleAsyncError("Failed to delete playlist", err)
            );
        }
    }
);

export const editPlaylist = createAsyncThunk<
    Playlist,
    PlaylistEdit,
    { rejectValue: ApiError }
>(
    "playlistSlice/editPlaylist",
    async ({ playlistId, playlistName, colorKey }, { rejectWithValue }) => {
        try {
            const updatedPlaylist: Playlist = {
                playlistId,
                playlistName,
                colorKey,
                updatedAt: Date.now()
            };

            const updatedCount = await playlistsTable.update(playlistId, {
                playlistName,
                colorKey,
                updatedAt: updatedPlaylist.updatedAt
            });

            if (updatedCount === 0) {
                throw new Error("Playlist not found.");
            }

            return updatedPlaylist;
        } catch (err) {
            return rejectWithValue(
                handleAsyncError("Failed to edit playlist", err)
            );
        }
    }
);


// export const addSongsToPlaylist

// export const removeSongsToPlaylist

export const playlistSlice = createSlice({
    name: "playlistSlice",
    initialState,
    reducers: {
        resetEditPlaylistStatus: (state) => {
            state.EditPlaylistStatus = "idle";
            state.EditPlaylistError = null;
        }
    },
    extraReducers: (builder) => {

        // Get Playlist
        builder
            .addCase(getPlaylist.pending, (state) => {
                state.PlaylistDataState = "loading";
                state.PlaylistDataError = null;
            })
            .addCase(getPlaylist.fulfilled, (state, action) => {
                state.PlaylistDataState = "success";
                state.PlaylistData = action.payload;
                state.PlaylistDataError = null;
            })
            .addCase(getPlaylist.rejected, (state, action) => {
                state.PlaylistDataState = "failed";
                state.PlaylistDataError =
                    action.payload?.message ?? "Failed to fetch playlists";
            });

        // Delete Playlist
        builder
            .addCase(deletePlaylist.pending, (state) => {
                state.DeletePlaylistStatus = "loading";
                state.DeletePlaylistError = null;
            })
            .addCase(deletePlaylist.fulfilled, (state, action) => {
                state.DeletePlaylistStatus = "success";
                state.PlaylistData = state.PlaylistData.filter((playlist) => playlist.playlistId !== action.payload);
                state.DeletePlaylistError = null;
            })
            .addCase(deletePlaylist.rejected, (state, action) => {
                state.DeletePlaylistStatus = "failed";
                state.DeletePlaylistError = action.payload?.message ?? "Failed to delete playlist";
            });

        // Create Playlist
        builder
            .addCase(createPlaylist.pending, (state) => {
                state.CreatePlaylistDataState = "loading";
                state.CreatePlaylistDataError = null;
            })
            .addCase(createPlaylist.fulfilled, (state, action) => {
                state.CreatePlaylistDataState = "success";
                state.PlaylistData.push(action.payload);
                state.CreatePlaylistDataError = null;
            })
            .addCase(createPlaylist.rejected, (state, action) => {
                state.CreatePlaylistDataState = "failed";
                state.CreatePlaylistDataError =
                    action.payload?.message ?? "Failed to create playlist";
            });

        // Edit playlist
        builder
            .addCase(editPlaylist.pending, (state) => {
                state.EditPlaylistStatus = "loading";
                state.EditPlaylistError = null;
            })
            .addCase(editPlaylist.fulfilled, (state, action) => {
                state.EditPlaylistStatus = "success";

                const index = state.PlaylistData.findIndex(
                    playlist => playlist.playlistId === action.payload.playlistId
                );

                if (index !== -1) {
                    state.PlaylistData[index] = {
                        ...state.PlaylistData[index],
                        ...action.payload
                    };
                }

                state.EditPlaylistError = null;
            })
            .addCase(editPlaylist.rejected, (state, action) => {
                state.EditPlaylistStatus = "failed";
                state.EditPlaylistError =
                    action.payload?.message ?? "Failed to edit playlist";
            });
    }
});

export const { resetEditPlaylistStatus } = playlistSlice.actions;
export default playlistSlice.reducer;