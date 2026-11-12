import { configureStore } from '@reduxjs/toolkit'
import homeSlice from './Slices/homeSlice'
import songSlice from './Slices/songSlice'
import favoriteSlice from './Slices/favoriteSlice'
import playlistSlice from './Slices/playlistSlice'

export const store = configureStore({
    reducer: {
        homeSlice,
        songSlice,
        favoriteSlice,
        playlistSlice
    }
})

// Infer the `RootState`, `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store