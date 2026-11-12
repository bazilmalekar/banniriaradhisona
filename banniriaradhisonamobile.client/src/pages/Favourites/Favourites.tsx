import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../services/hooks";
import type { RootState } from "../../services/store";
import { fetchFavourites, removeFavourite, type FavoriteSongs } from "../../services/Slices/favoriteSlice";
import "./favourites.css";
import FavouritesListSkeleton from "../../shared/SkeletonLoading/FavouritesListSkeleton";
import SongErrorState from "../../shared/ErrorPages/home/SongErrorState";
import ActionBottomSheet from "../../shared/ActionBottomSheet/ActionBottomSheet";


const Favourites: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { data, dataState, error } = useAppSelector((state: RootState) => state.favoriteSlice);

    const [selectedSong, setSelectedSong] = useState<FavoriteSongs | null>(null);
    const [deletedsSong, setIsDeletedSong] = useState<{
        songId?: number;
        isdeleted: boolean;
    }>({
        songId: undefined,
        isdeleted: false
    });

    // Fetch songs if they haven't been loaded yet
    useEffect(() => {
        if (dataState === "idle") {
            void dispatch(fetchFavourites());
        }
    }, [dispatch, dataState]);

    // Navigate to selected song
    const handlePlaySong = (songId: number) => navigate(`/song?songId=${songId}`);

    // Open song options
    const handleOptions = (e: React.MouseEvent<HTMLButtonElement>, song: FavoriteSongs) => {
        e.stopPropagation();
        setSelectedSong(song);
    };

    const handleDeleteFavourite = (songId?: number) => {
        setIsDeletedSong({
            songId,
            isdeleted: true
        });
        setSelectedSong(null);
    };

    if (dataState === "loading" && data.length === 0) return <FavouritesListSkeleton />;

    if (dataState === "failed" && error) {
        return (
            <SongErrorState
                title="Unable to load favourite songs"
                message={error ?? undefined}
                onRetry={() => { void dispatch(fetchFavourites()) }}
            />
        );
    }

    return (
        <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="
                mx-2 my-2 flex shrink-0 items-center gap-4
                rounded-2xl bg-[#E8F4FC] px-4 py-4
                dark:bg-[#263F4B]
                border border-[#DCEBF0]/80 dark:border-white/10
            ">
                {/* Favourite icon */}
                <div className="
                    flex size-16 shrink-0 items-center justify-center
                    rounded-2xl bg-[#D8EDFC]
                    dark:bg-[#304F5D]
                    border border-[#DCEBF0]/80 dark:border-white/10
                ">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        className="text-[#1688DF] dark:text-[#83C9E8]"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                    >
                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                    </svg>
                </div>
                {/* Heading and subtitle */}
                <div className="min-w-0 flex-1">
                    <h1 className="text-xl font-bold leading-tight text-[#304B68] dark:text-[#E3EEF4] sm:text-2xl">Favourite songs</h1>
                    <p className="mt-1 text-sm font-medium text-[#71869E] dark:text-[#A9C0CC] sm:text-base">{data.length} {data.length === 1 ? "song" : "songs"} in your favourites</p>
                </div>
            </div>
            {/* Favourite songs */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-5 sm:px-5">
                {data.length > 0 ? (
                    <div className="space-y-2">
                        {(Array.isArray(data) ? [...data] : [])
                            .sort((a, b) => a.songId - b.songId)
                            .map((song, index) => (
                                <div key={song.songId}>
                                    <div
                                        key={song.songId}
                                        style={{
                                            animationDelay: `${Math.min(index * 35, 350)}ms`
                                        }}
                                        className={`fav_row ${deletedsSong.songId === song.songId ? "deleted" : ""} song-card-enter flex items-center gap-3 rounded-[1.15rem] border border-white/70 bg-white/70 px-3 py-3 shadow-[0_4px_16px_rgba(57,122,154,0.04)] backdrop-blur-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-[0_7px_20px_rgba(57,122,154,0.09)] dark:border-white/10 dark:bg-[#1C303B]/45 dark:hover:bg-[#263F4B]/70 sm:gap-4 sm:px-5`}
                                        onClick={() => handlePlaySong(song.songId)}
                                        onAnimationEnd={(e) => {
                                            if (
                                                e.animationName === "deleteFav" &&
                                                deletedsSong.songId === song.songId
                                            ) {
                                                void dispatch(removeFavourite({ songId: song.songId }));
                                            }
                                        }}
                                    >
                                        {/* Song number */}
                                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/80 bg-[#E5F2FC] text-lg font-semibold text-[#347FC4] shadow-sm dark:border-white/10 dark:bg-slate-700/70 dark:text-sky-300 sm:size-14 sm:text-xl">
                                            {String(song.songNumber).padStart(2, "0")}
                                        </div>
                                        {/* Song title */}
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-base font-semibold leading-snug text-[#304B68] dark:text-[#E3EEF4] sm:text-lg">{song?.songTitleKa ?? "Loading..."}</h3>
                                        </div>
                                        {/* More options */}
                                        <button
                                            type="button"
                                            onClick={(e) => handleOptions(e, song)}
                                            className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#8295AD] transition-colors hover:bg-sky-100/70 dark:text-slate-400 dark:hover:bg-slate-700"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="size-6"
                                                aria-hidden="true"
                                            >
                                                <circle cx="12" cy="5" r="1.8" />
                                                <circle cx="12" cy="12" r="1.8" />
                                                <circle cx="12" cy="19" r="1.8" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    /* Empty state */
                    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[1.5rem] border border-white/70 bg-white/45 px-5 py-8 text-center shadow-[0_5px_20px_rgba(57,122,154,0.04)] backdrop-blur-lg dark:border-white/10 dark:bg-[#1C303B]/35">
                        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[#E5F2FC] text-[#1683D8] dark:bg-slate-700/70 dark:text-sky-300">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 14"
                                fill="currentColor"
                                className="size-6"
                                aria-hidden="true"
                            >
                                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-[#526B8D] dark:text-slate-200">No favourite songs added yet</h2>
                        <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#8298B1] dark:text-slate-400 sm:text-base">
                            Tap the
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="mx-1 inline-block size-3.5"
                                aria-hidden="true"
                            >
                                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                            </svg>
                            icon on any song to add it to your favourites.
                        </p>
                    </div>
                )}
            </div>
            <ActionBottomSheet
                isOpen={!!selectedSong}
                onClose={() => setSelectedSong(null)}
            >
                {
                    selectedSong && (
                        <>
                            <div className="mb-5">
                                <h3 className="text-lg font-semibold text-[#304B68] dark:text-[#E3EEF4]">{selectedSong?.songTitleKa}</h3>
                                <p className="mt-1 text-sm text-[#8295AD] dark:text-slate-400">Song {String(selectedSong?.songNumber).padStart(3, "0")} </p>
                            </div>
                            <button
                                type="button"
                                className="mt-1 flex w-full items-center gap-4 rounded-xl bg-red-50 px-4 py-3.5 text-left text-red-600 transition-colors hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                                onClick={() => handleDeleteFavourite(selectedSong?.songId)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="size-6"
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4 4 16 16" />
                                </svg>
                                <span className="font-medium">Remove from favourites</span>
                            </button>
                        </>
                    )
                }
            </ActionBottomSheet>
        </section >
    );
};

export default Favourites;