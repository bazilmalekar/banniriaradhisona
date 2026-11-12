
import React from "react";

const PlaylistListSkeleton: React.FC = () => {
    return (
        <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden animate-pulse">

            {/* Header skeleton */}
            <div className="
                mx-2 my-2 flex shrink-0 items-center gap-4
                rounded-2xl bg-[#E8F4FC] px-4 py-4
                dark:bg-[#263F4B]
                border border-[#DCEBF0]/80 dark:border-white/10
            ">

                {/* Playlist icon placeholder */}
                <div className="
                    flex size-16 shrink-0 items-center justify-center
                    rounded-2xl bg-[#D8EDFC]
                    dark:bg-[#304F5D]
                    border border-[#DCEBF0]/80 dark:border-white/10
                ">
                    <div className="size-8 rounded-lg bg-[#BBDCF2] dark:bg-slate-600" />
                </div>

                {/* Heading placeholders */}
                <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-6 w-36 max-w-[70%] rounded-md bg-[#C8DFEF] dark:bg-slate-600" />
                    <div className="h-4 w-52 max-w-[85%] rounded-md bg-[#D5E7F2] dark:bg-slate-700" />
                </div>

                {/* Create button placeholder */}
                <div className="
                    h-10 w-24 shrink-0 rounded-xl
                    bg-[#BBDCF2] dark:bg-slate-600
                " />
            </div>

            {/* Playlist cards skeleton */}
            <div className="
                min-h-0 flex-1 overflow-hidden
                px-3 pb-5 sm:px-5
            ">
                <div className="space-y-2">

                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="
                                flex items-center gap-3
                                rounded-[1.15rem]
                                border border-white/70
                                bg-white/70 px-3 py-3
                                shadow-[0_4px_16px_rgba(57,122,154,0.04)]
                                dark:border-white/10
                                dark:bg-[#1C303B]/45
                                sm:gap-4 sm:px-5
                            "
                        >
                            {/* Playlist colour accent */}
                            <div
                                className={`
                                    h-12 w-1.5 shrink-0 rounded-full
                                    ${[
                                        "bg-[#2680B8]/40",
                                        "bg-[#739D7B]/40",
                                        "bg-[#D3A34F]/40",
                                        "bg-[#397A9A]/40"
                                    ][index % 4]}
                                `}
                            />

                            {/* Playlist information */}
                            <div className="min-w-0 flex-1 space-y-2">
                                <div
                                    className="
                                        h-5 rounded-md
                                        bg-[#DCEAF3]
                                        dark:bg-slate-700
                                        sm:h-6
                                    "
                                    style={{
                                        width: `${[65, 80, 55, 72, 60, 75][index]}%`
                                    }}
                                />

                                <div
                                    className="
                                        h-3.5 rounded-md
                                        bg-[#E5EFF5]
                                        dark:bg-slate-700/70
                                    "
                                    style={{
                                        width: `${[22, 28, 18, 25, 20, 30][index]}%`
                                    }}
                                />
                            </div>

                            {/* More options placeholder */}
                            <div className="
                                flex size-9 shrink-0
                                items-center justify-center
                            ">
                                <div className="flex flex-col gap-1">
                                    <span className="size-1.5 rounded-full bg-[#D0DFE9] dark:bg-slate-600" />
                                    <span className="size-1.5 rounded-full bg-[#D0DFE9] dark:bg-slate-600" />
                                    <span className="size-1.5 rounded-full bg-[#D0DFE9] dark:bg-slate-600" />
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
};

export default PlaylistListSkeleton;
