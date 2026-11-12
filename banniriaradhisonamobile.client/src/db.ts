import { Dexie, type EntityTable, type Table } from "dexie"
import type { Playlist, PlaylistSong } from "./services/Slices/playlistSlice";
import type { Favorite } from "./services/Slices/favoriteSlice";

const db = new Dexie("AraDb") as Dexie & {
    favorites: EntityTable<Favorite, "songId">;
    playlists: EntityTable<Playlist, "playlistId">;
    playlistSongs: Table<PlaylistSong, [string, number]>;
};

db.version(1).stores({
    favorites: "songId, addedAt"
});

db.version(2).stores({
    favorites: "songId, addedAt",
    playlists: "playlistId, userId, updatedAt",
    playlistSongs: "[playlistId+songId], playlistId, songId, [playlistId+sortOrder]"
});

export const favoritesTable = db.table("favorites");
export const playlistsTable = db.table("playlists");
export const playlistSongsTable = db.table("playlistSongs");