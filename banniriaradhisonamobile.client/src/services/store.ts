import { configureStore } from '@reduxjs/toolkit'
import homeSlice from './Slices/homeSlice'

export const store = configureStore({
    reducer: {
        homeSlice
    }
})

// Infer the `RootState`, `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store