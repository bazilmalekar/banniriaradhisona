import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../services/hooks";
import type { RootState } from "../../services/store";
import { getSong } from "../../services/Slices/homeSlice";
import { useNavigate, useSearchParams } from "react-router";
import { formatLyrics } from "../../utils/formatLyrics";
import MusicPlayer from "../../components/home/MusicPlayer/MusicPlayer";
import "./homepage.css";
import SongNotFound from "../../shared/ErrorPages/SongNotFound";
import HomeSkeleton from "../../shared/SkeletonLoading/HomeSkeleton";
import SongErrorState from "../../shared/ErrorPages/SongErrorState";

const HomePage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const songIdParam = searchParams.get("songId");
    const songId = songIdParam ? Number(songIdParam) : undefined;
    const requestedSongRef = useRef<number | null>(null);

    const { data, dataState, error, errorCode } = useAppSelector((state: RootState) => state.homeSlice);
    const lyrics = formatLyrics(data?.song.songLyr);

    useEffect(() => {
        if (songId && data?.song.songId === songId) return;
        if (requestedSongRef.current === (songId ?? 0)) return;
        requestedSongRef.current = songId ?? 0;

        const loadSong = async () => {
            try {
                const result = await dispatch(getSong({ id: songId })).unwrap();
                navigate(`/song?songId=${result.song.songId}`, { replace: true });
            } catch (error) {
                requestedSongRef.current = null;
                console.error("Failed to fetch song:", error);
            }
        };

        void loadSong();

    }, [dispatch, songId, navigate, data?.song.songId]);

    if (dataState === "loading") return <HomeSkeleton />;

    if (dataState === "failed" && error) {
        if (errorCode === 404) {

            return <SongNotFound />;
        }
        return (
            <SongErrorState
                title="Unable to load song"
                message={error ?? undefined}
                onRetry={() => {
                    void dispatch(getSong({ id: songId }));
                }}
            />
        );
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {/* Sticky title section */}
            <section className="z-10 flex shrink-0 items-start gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
                {/* Song number */}
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border-2 border-white/90 bg-sky-100/70 text-xl font-semibold text-[#347FC4] shadow-sm dark:border-white/15 dark:bg-slate-700/70 dark:text-sky-300 sm:size-14 sm:text-2xl">
                    {data?.song.songNumber ?? "--"}
                </div>
                {/* Title and scale */}
                <div className="min-w-0 flex-1 pt-0.5">
                    <h1 className="text-[1.2rem] font-semibold leading-snug tracking-tight text-[#304B68] dark:text-[#E3EEF4] sm:text-[1.4rem]">
                        {data?.song.songTitleKa ?? "Loading song..."}
                    </h1>
                    {
                        data?.song.songScale && (
                            <div className="mt-1.5 flex items-center gap-2 text-sm text-[#59799F] dark:text-slate-300 sm:text-base">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="size-6 shrink-0 text-[#4B91D5]"
                                    aria-hidden="true"
                                >
                                    <path d="M9 13c0 1.105-1.12 2-2.5 2S4 14.105 4 13s1.12-2 2.5-2 2.5.895 2.5 2" />
                                    <path fillRule="evenodd" d="M9 3v10H8V3z" />
                                    <path d="M8 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 13 2.22V4L8 5z" />
                                </svg>
                                <span>
                                    Scale:{" "}
                                    <span className="font-medium text-[#2785D9] dark:text-sky-300">
                                        {data?.song.songScale || "Not added"}
                                    </span>
                                </span>
                            </div>
                        )
                    }
                </div>
                <div className="flex shrink-0 items-center gap-1 pt-1">
                    {/* Favourite */}
                    <button
                        type="button"
                        aria-label="Add to favourites"
                        className="flex size-10 items-center justify-center rounded-full text-[#59799F] transition-colors hover:bg-sky-100/70 hover:text-rose-500 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="size-7"
                            aria-hidden="true"
                        >
                            <path d="m8 14-1.1-1C2.7 9.2 1 7.5 1 5.3 1 3.3 2.6 1.8 4.5 1.8c1.3 0 2.5.7 3.5 1.9 1-1.2 2.2-1.9 3.5-1.9C13.4 1.8 15 3.3 15 5.3c0 2.2-1.7 3.9-5.9 7.7L8 14Z" />
                        </svg>
                    </button>
                    {/* More options */}
                    <button
                        type="button"
                        aria-label="Song options"
                        className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#59799F] transition-colors hover:bg-sky-100/70 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="size-6"
                            aria-hidden="true"
                        >
                            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                        </svg>
                    </button>
                </div>
            </section>
            {/* Combined lyrics and music player surface */}
            <section className="relative mx-3 mb-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/35 shadow-[0_8px_28px_rgba(57,122,154,0.06)] backdrop-blur-xl sm:mx-5 dark:border-white/10 dark:bg-[#1C303B]/45 dark:shadow-[0_8px_28px_rgba(0,0,0,0.12)]">
                <div className="lyrics-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-36 pt-5 sm:px-7 sm:pb-40">
                    <div className="space-y-1.5">
                        {lyrics.map((stanza, stanzaIndex) => (
                            <div key={stanzaIndex}>
                                {stanza.map((line, lineIndex) => (
                                    <p key={lineIndex} className="text-[1.2rem] leading-[1.65] text-[#355778] dark:text-[#C5D9E4] sm:text-[1.4rem]">
                                        {line}
                                    </p>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Music player */}
                <MusicPlayer audioUrl={data?.audioUrl} />
            </section >
        </div >
    );

}

export default HomePage;