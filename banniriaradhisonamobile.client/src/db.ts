import { Dexie, type EntityTable } from "dexie"

interface Favorite {
    songId: number;
    addedAt: number;
}

const db = new Dexie("AraDb") as Dexie & {
    favorites: EntityTable<Favorite, "songId">
}

db.version(1).stores({
    favorites: "songId, addedAt"
});

export const favoritesTable = db.table("favorites");