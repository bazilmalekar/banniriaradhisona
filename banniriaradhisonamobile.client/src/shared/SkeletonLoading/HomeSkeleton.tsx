
import React from "react";

const HomeSkeleton: React.FC = () => {
    const placeholder = "bg-[#E1EAE7]/80 dark:bg-[#405653]/70";
    const lyricPlaceholder = "bg-[#E4ECE9]/75 dark:bg-[#405653]/65";

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden animate-pulse">

            {/* Song title section */}
            <section className="z-10 flex shrink-0 items-start gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">

                {/* Song number */}
                <div className={`size-12 shrink-0 rounded-2xl ${placeholder} sm:size-14`} />

                {/* Title and scale */}
                <div className="min-w-0 flex-1 space-y-3 pt-1">
                    <div className={`h-6 w-3/4 max-w-64 rounded-lg ${placeholder} sm:h-7`} />

                    <div className="flex items-center gap-2">
                        <div className={`size-5 rounded-full ${placeholder}`} />
                        <div className={`h-4 w-28 rounded-md ${placeholder}`} />
                    </div>
                </div>

                {/* Favourite and options */}
                <div className="flex shrink-0 items-center gap-1 pt-1">
                    <div className={`size-10 rounded-full ${placeholder}`} />
                    <div className={`size-8 rounded-full ${placeholder}`} />
                </div>
            </section>

            {/* Lyrics and player surface */}
            <section className="relative mx-3 mb-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/35 shadow-[0_8px_28px_rgba(57,122,154,0.04)] backdrop-blur-xl sm:mx-5 dark:border-white/10 dark:bg-[#1C303B]/45">

                {/* Lyrics placeholders */}
                <div className="min-h-0 flex-1 space-y-8 overflow-hidden px-5 pb-36 pt-5 sm:px-7 sm:pb-40">

                    <div className="space-y-3">
                        <div className={`h-6 w-[85%] rounded-md ${lyricPlaceholder} sm:h-7`} />
                        <div className={`h-6 w-[72%] rounded-md ${lyricPlaceholder} sm:h-7`} />
                        <div className={`h-6 w-[90%] rounded-md ${lyricPlaceholder} sm:h-7`} />
                        <div className={`h-6 w-[65%] rounded-md ${lyricPlaceholder} sm:h-7`} />
                    </div>

                    <div className="space-y-3">
                        <div className={`h-6 w-[78%] rounded-md ${lyricPlaceholder} sm:h-7`} />
                        <div className={`h-6 w-[92%] rounded-md ${lyricPlaceholder} sm:h-7`} />
                        <div className={`h-6 w-[68%] rounded-md ${lyricPlaceholder} sm:h-7`} />
                    </div>

                    <div className="space-y-3">
                        <div className={`h-6 w-[88%] rounded-md ${lyricPlaceholder} sm:h-7`} />
                        <div className={`h-6 w-[74%] rounded-md ${lyricPlaceholder} sm:h-7`} />
                    </div>
                </div>

                {/* Player placeholder */}
                <div className="absolute inset-x-0 bottom-0 z-20 pt-6 pb-3">

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#E5F2FA]/85 to-[#DCECF8]/95 dark:via-[#193741]/90 dark:to-[#193741]/95" />

                    <div className="relative space-y-4 px-5">

                        {/* Progress bar */}
                        <div className={`h-1.5 w-full rounded-full ${placeholder}`} />

                        <div className="flex items-center justify-center">
                            <div className="flex items-center gap-7">
                                <div className={`size-10 rounded-full ${placeholder}`} />
                                <div className="size-14 rounded-full bg-[#D6EAF8]/90 dark:bg-[#506D83]/80" />
                                <div className={`size-10 rounded-full ${placeholder}`} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomeSkeleton;
