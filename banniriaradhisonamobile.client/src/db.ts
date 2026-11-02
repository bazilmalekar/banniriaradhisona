import { Dexie, type EntityTable } from "dexie"

interface Favorite {
    id: number;
}

const db = new Dexie("FriendsDatabase") as Dexie & {
    favorites: EntityTable<Favorite, "id">
}

db.version(1).stores({
    favorites: "++id"
});

export const favoritesTable = db.table("favorites");