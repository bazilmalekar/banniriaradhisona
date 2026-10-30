import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import Layout from "./components/layout/Layout/Layout";
import HomeSkeleton from "./shared/SkeletonLoading/HomeSkeleton";

const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const SongsList = lazy(() => import("./pages/SongsList/SongsList"));
const Favourites = lazy(() => import("./pages/Favourites/Favourites"));
const Downloads = lazy(() => import("./pages/Downloads/Downloads"));
const Playlists = lazy(() => import("./pages/Playlists/Playlists"));
const NotFound = lazy(() => import("./pages/Downloads/NotFound/NotFound"));

//Use the helper function if multiple components has to be wrapped with common fallback.
const withNotFoundSuspense = (element: ReactNode) => <Suspense fallback={<p>Loading...</p>}>{element}</Suspense>;

export const router = createBrowserRouter([
    {
        element: <Layout />,
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<HomeSkeleton />}>
                        < HomePage />
                    </Suspense>
                )
            },
            {
                path: "/song",
                element: (
                    <Suspense fallback={<HomeSkeleton />}>
                        < HomePage />
                    </Suspense>
                )
            },
            {
                path: "home",
                element: <Navigate to="/" replace />,
            },
            {
                path: "songs",
                element: (
                    <Suspense fallback={<p>Loading...</p>}>
                        <SongsList />
                    </Suspense>
                )
            },
            {
                path: "favourites",
                element: (
                    <Suspense fallback={<p>Loading...</p>}>
                        <Favourites />
                    </Suspense>
                )
            },
            {
                path: "downloads",
                element: (
                    <Suspense fallback={<p>Loading...</p>}>
                        <Downloads />
                    </Suspense>
                )
            },
            {
                path: "playlists",
                element: (
                    <Suspense fallback={<p>Loading...</p>}>
                        <Playlists />
                    </Suspense>
                )
            },
            {
                path: "*",
                element: withNotFoundSuspense(<NotFound />)
            }
        ]
    }
]);