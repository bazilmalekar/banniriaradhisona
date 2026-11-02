import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import useDebounce from "../../Hooks/useDebounce";
import { useAppDispatch, useAppSelector } from "../../services/hooks";
import type { RootState } from "../../services/store";
import { getAllSongs } from "../../services/Slices/songSlice";
import SongErrorState from "../../shared/ErrorPages/home/SongErrorState";
import "./songsList.css";
import SongsListSkeleton from "../../shared/SkeletonLoading/SongsListSkeleton";
import SongNotFoundLst from "../../shared/ErrorPages/songList/SongNotFoundLst";

const SongsList: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const songsListRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const { songs, dataState, error } = useAppSelector(
        (state: RootState) => state.songSlice
    );

    const [searchValue, setSearchValue] = useState("");
    const debounceSearch = useDebounce(searchValue);

    // Fetch songs only once
    useEffect(() => {
        if (dataState === "idle") {
            void dispatch(getAllSongs());
        }
    }, [dispatch, dataState]);

    // Filter songs locally
    const filteredSongs = useMemo(() => {
        const search = debounceSearch.trim().toLowerCase();
        if (!search) return songs;
        return songs.filter((song) =>
            song.songTitleEn.toLowerCase().includes(search) || String(song.songCount).includes(search));
    }, [songs, debounceSearch]);

    // scroll top when user searches songs
    useEffect(() => {
        songsListRef.current?.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [debounceSearch]);

    // Navigate to selected song
    const handleSongClick = (songId: number) => {
        navigate(`/song?songId=${songId}`);
    };

    if (dataState === "loading") {
        return <SongsListSkeleton />
    }

    if (dataState === "failed") {
        return (
            <SongErrorState
                title="Unable to load songs"
                message={error ?? undefined}
                onRetry={() => {
                    void dispatch(getAllSongs());
                }}
            />
        );
    }

    return (
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {/* Search bar */}
            <div className="shrink-0 px-4 py-4 sm:px-6">
                <div className="flex items-center gap-3 rounded-full border border-white/80 bg-white/65 px-5 py-3 shadow-[0_4px_18px_rgba(57,122,154,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-[#1C303B]/50">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="size-7 shrink-0 text-[#668BAF] dark:text-slate-400"
                        aria-hidden="true"
                    >
                        <circle cx="11" cy="11" r="7" />
                        <path strokeLinecap="round" d="m16 16 4 4" />
                    </svg>
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        name="song_search"
                        placeholder="Search by song number or title..."
                        className="min-w-0 flex-1 bg-transparent text-base text-[#304B68] outline-none placeholder:text-[#8298B1] dark:text-[#E3EEF4] dark:placeholder:text-slate-400 sm:text-lg"
                    />
                    {searchValue && (
                        <button
                            type="button"
                            onClick={() => setSearchValue("")}
                            aria-label="Clear search"
                            className="flex size-7 shrink-0 items-center justify-center rounded-full text-[#668097] hover:bg-sky-100 dark:text-slate-400 dark:hover:bg-slate-700"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="size-5"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" d="m18 6-12 12M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
            {/* Songs list */}
            <div ref={songsListRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-4 sm:px-5">
                <div className="space-y-3">
                    {filteredSongs.length > 0 ? (
                        filteredSongs.map((song, index) => (
                            <div
                                key={`${debounceSearch}-${song.songId}`}
                                role="button"
                                tabIndex={0}
                                onClick={() => handleSongClick(song.songId)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        handleSongClick(song.songId);
                                    }
                                }}
                                style={{
                                    animationDelay: `${Math.min(index * 35, 350)}ms`
                                }}
                                className="song-card-enter flex cursor-pointer items-center gap-3 rounded-[1.15rem] border border-white/70 bg-white/70 px-3 py-3 shadow-[0_4px_16px_rgba(57,122,154,0.04)] backdrop-blur-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-[0_7px_20px_rgba(57,122,154,0.09)] active:scale-[0.985] dark:border-white/10 dark:bg-[#1C303B]/45 dark:hover:bg-[#263F4B]/70 sm:gap-4 sm:px-5 sm:py-3"
                            >
                                {/* Song number */}
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/80 bg-[#E5F2FC] text-lg font-semibold text-[#347FC4] shadow-sm dark:border-white/10 dark:bg-slate-700/70 dark:text-sky-300 sm:size-14 sm:text-xl">
                                    {String(song.songCount).padStart(2, "0")}
                                </div>
                                {/* Song title */}
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-base font-semibold leading-snug text-[#304B68] dark:text-[#E3EEF4] sm:text-lg">{song.songTitle}</h3>
                                </div>
                                {/* Play button */}
                                {/* <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSongClick(song.songId);
                                    }}
                                    aria-label={`Play song ${song.songCount}`}
                                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#398FCB] text-white shadow-[0_2px_7px_rgba(57,143,203,0.18)] transition-all duration-200 hover:scale-105 hover:bg-[#287DB8] hover:shadow-[0_3px_10px_rgba(57,143,203,0.28)] active:scale-90 dark:bg-[#347FC4] dark:hover:bg-[#438FC7]"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="size-4"
                                        aria-hidden="true"
                                    >
                                        <path d="M7 4.8a1 1 0 0 1 1.52-.85l11.2 6.7a1.58 1.58 0 0 1 0 2.7l-11.2 6.7A1 1 0 0 1 7 19.2V4.8Z" />
                                    </svg>
                                </button> */}
                                {/* More options */}
                                <div className="flex size-6 shrink-0 items-center justify-center text-[#8295AD] dark:text-slate-400">
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
                                </div>
                            </div>
                        ))
                    ) : (
                        <SongNotFoundLst onClearSearch={() => {
                            setSearchValue("");
                            searchInputRef.current?.focus();
                        }} />
                    )}
                </div>
            </div>
        </section>
    );

};

export default SongsList;
