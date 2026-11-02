import { configureStore } from '@reduxjs/toolkit'
import homeSlice from './Slices/homeSlice'
import songSlice from './Slices/songSlice'

export const store = configureStore({
    reducer: {
        homeSlice,
        songSlice
    }
})

// Infer the `RootState`, `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store