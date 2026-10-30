import { useEffect, useRef, useState } from "react";
import "./musicplayer.css";

interface MusicPlayerProps {
    audioUrl?: string | null;
}

const formatTime = (seconds: number): string => {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
};

const MusicPlayer: React.FC<MusicPlayerProps> = ({ audioUrl }) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showMessage, setShowMessage] = useState(false);

    const progress = duration > 0
        ? (currentTime / duration) * 100
        : 0;

    useEffect(() => {
        const audio = audioRef.current;

        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        setShowMessage(false);

        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }, [audioUrl]);

    const togglePlayback = async () => {
        const audio = audioRef.current;

        if (!audioUrl || !audio) {
            setShowMessage(true);
            return;
        }

        setShowMessage(false);

        if (audio.paused) {
            try {
                await audio.play();
            } catch (error) {
                console.error("Unable to play audio:", error);
            }
        } else {
            audio.pause();
        }
    };

    const seekBy = (seconds: number) => {
        const audio = audioRef.current;

        if (!audio || !Number.isFinite(audio.duration)) {
            return;
        }

        audio.currentTime = Math.max(
            0,
            Math.min(audio.currentTime + seconds, audio.duration)
        );
    };

    const handleSeek = (value: number) => {
        const audio = audioRef.current;

        if (!audio || !Number.isFinite(audio.duration)) {
            return;
        }

        audio.currentTime = (value / 100) * audio.duration;
        setCurrentTime(audio.currentTime);
    };

    return (
        <div className="absolute inset-x-0 bottom-0 z-20 pt-6 pb-0">
            {/* Blend the player into the lyrics surface */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#DCECF8]/80 to-[#DCECF8]/95 dark:via-[#193741]/90 dark:to-[#193741]/95"
            />

            {/* Compact, borderless glass player */}
            <div className="relative overflow-hidden bg-white/20 px-4 pt-2 pb-2 backdrop-blur-2xl dark:bg-[#24444C]/20 sm:px-5">
                {/* Subtle ambient glow */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-16 left-1/2 size-32 -translate-x-1/2 rounded-full bg-[#B8DFF5]/35 blur-3xl dark:bg-[#397A9A]/20"
                />

                <div className="relative">
                    {/* Progress and timestamps */}
                    <div className="mb-2 flex items-center gap-3 text-xs font-medium tabular-nums text-[#52769B] dark:text-[#B5CCD8] sm:text-sm">
                        <span className="w-9 shrink-0">
                            {formatTime(currentTime)}
                        </span>

                        <input
                            type="range"
                            min={0}
                            max={100}
                            step={0.1}
                            value={progress}
                            onChange={(event) =>
                                handleSeek(Number(event.target.value))
                            }
                            aria-label="Song progress"
                            style={{
                                background: `linear-gradient(to right, #438FC7 0%, #69B5DF ${progress}%, rgba(103, 157, 177, 0.25) ${progress}%, rgba(103, 157, 177, 0.25) 100%)`,
                            }}
                            className="h-1.5 min-w-0 flex-1 cursor-pointer appearance-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#438FC7]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-[#438FC7] [&::-webkit-slider-thumb]:shadow-md dark:[&::-webkit-slider-thumb]:border-[#D9F3EC] dark:[&::-webkit-slider-thumb]:bg-[#62B7C5] [&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-[#438FC7] dark:[&::-moz-range-thumb]:border-[#D9F3EC] dark:[&::-moz-range-thumb]:bg-[#62B7C5]"
                        />

                        <span className="w-9 shrink-0 text-right">
                            {formatTime(duration)}
                        </span>
                    </div>

                    {/* Playback controls */}
                    <div className="flex items-center justify-center gap-8 sm:gap-12">
                        {/* Rewind 10 seconds */}
                        <button
                            type="button"
                            onClick={() => seekBy(-10)}
                            aria-label="Rewind 10 seconds"
                            className="flex size-10 items-center justify-center rounded-full text-[#527B9B] transition duration-200 hover:bg-[#DCEFFA]/70 hover:text-[#287CA8] active:scale-90 dark:text-[#B5CEDC] dark:hover:bg-white/10 dark:hover:text-[#8BD5C8]"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="size-6 drop-shadow-[0_0_6px_rgba(100,190,240,0.75)] transition-all duration-200"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M11 5v14L2 12l9-7Zm11 0v14l-9-7 9-7Z" />
                                <path
                                    d="M1.5 5v14"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>

                        {/* Play / pause */}
                        <button
                            type="button"
                            onClick={togglePlayback}
                            aria-label={isPlaying ? "Pause" : "Play"}
                            className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#438FC7] text-white shadow-[0_7px_16px_rgba(48,75,104,0.36),0_3px_5px_rgba(48,75,104,0.16)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_12px_23px_rgba(48,75,104,0.42),0_4px_7px_rgba(48,75,104,0.2)] active:translate-y-0 active:scale-95 dark:bg-[#397A9A] dark:shadow-[0_7px_16px_rgba(0,0,0,0.42)] dark:hover:shadow-[0_12px_23px_rgba(0,0,0,0.5)]"
                        >
                            {isPlaying ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-pause-fill" viewBox="0 0 16 16">
                                    <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-play-fill" viewBox="0 0 16 16">
                                    <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
                                </svg>
                            )}
                        </button>
                        {/* Play / pause */}
                        {/* Play / pause */}
                        {/* <button
                            type="button"
                            onClick={togglePlayback}
                            aria-label={isPlaying ? "Pause" : "Play"}
                            className="flex size-14 shrink-0 items-center justify-center rounded-full text-[#527B9B] transition duration-200 hover:bg-[#DCEFFA]/70 hover:text-[#287CA8] active:scale-90 dark:text-[#B5CEDC] dark:hover:bg-white/10 dark:hover:text-[#8BD5C8]"
                        >
                            {isPlaying ? (
                                <svg
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    className="size-10 drop-shadow-[0_0_6px_rgba(100,190,240,0.75)] transition-all duration-200"
                                >
                                    <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5" />
                                </svg>
                            ) : (
                                <svg
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    className="size-10 drop-shadow-[0_0_6px_rgba(100,190,240,0.75)] transition-all duration-200"
                                >
                                    <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
                                </svg>
                            )}
                        </button> */}

                        {/* Forward 10 seconds */}
                        <button
                            type="button"
                            onClick={() => seekBy(10)}
                            aria-label="Forward 10 seconds"
                            className="flex size-10 items-center justify-center rounded-full text-[#527B9B] transition duration-200 hover:bg-[#DCEFFA]/70 hover:text-[#287CA8] active:scale-90 dark:text-[#B5CEDC] dark:hover:bg-white/10 dark:hover:text-[#8BD5C8]"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="size-6 drop-shadow-[0_0_6px_rgba(100,190,240,0.75)] transition-all duration-200"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M13 5v14l9-7-9-7ZM2 5v14l9-7-9-7Z" />
                                <path
                                    d="M22.5 5v14"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Missing audio message */}
                    {showMessage && (
                        <p
                            role="status"
                            className="mt-2 text-center text-sm text-[#52769B] dark:text-[#B5CCD8]"
                        >
                            Audio is not available for this song yet.
                        </p>
                    )}
                </div>

                {audioUrl && (
                    <audio
                        ref={audioRef}
                        src={audioUrl}
                        preload="metadata"
                        onLoadedMetadata={(event) =>
                            setDuration(event.currentTarget.duration)
                        }
                        onDurationChange={(event) =>
                            setDuration(event.currentTarget.duration)
                        }
                        onTimeUpdate={(event) =>
                            setCurrentTime(event.currentTarget.currentTime)
                        }
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={() => {
                            setIsPlaying(false);
                            setCurrentTime(0);
                        }}
                        onError={() => setIsPlaying(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default MusicPlayer;