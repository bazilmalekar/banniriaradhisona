import React from "react";

const SongsListSkeleton: React.FC = () => {
    const placeholder = "bg-[#E1EAE7]/80 dark:bg-[#405653]/70";
    const cardPlaceholder = "bg-white/70 dark:bg-[#1C303B]/45";

    return (
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden animate-pulse">
            <div className="shrink-0 px-4 py-4 sm:px-6">
                <div className="flex items-center gap-3 rounded-full border border-white/80 bg-white/65 px-5 py-3 shadow-[0_4px_18px_rgba(57,122,154,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-[#1C303B]/50">
                    <div className={`size-7 shrink-0 rounded-full ${placeholder}`} />
                    <div className={`h-5 w-3/4 rounded-md ${placeholder}`} />
                </div>
            </div>
            {/* song card */}
            <div className="min-h-0 flex-1 space-y-3 overflow-hidden px-3 pb-4 sm:px-5">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-3 rounded-[1.15rem] border border-white/70 ${cardPlaceholder} px-3 py-3 shadow-[0_4px_16px_rgba(57,122,154,0.04)] backdrop-blur-lg sm:gap-4 sm:px-5 sm:py-3`}
                    >
                        <div className={`size-12 shrink-0 rounded-xl border border-white/80 bg-[#E5F2FC] dark:border-white/10 dark:bg-slate-700/70 sm:size-14`} />
                        <div className="min-w-0 flex-1 space-y-2">
                            <div
                                className={`h-5 rounded-md ${placeholder} sm:h-6`}
                                style={{
                                    width: `${65 + (index % 3) * 10}%`
                                }}
                            />
                        </div>
                        {/* <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#D6EAF8]/90 dark:bg-[#506D83]/80">
                            <div className="size-3 rounded-sm bg-white/70 dark:bg-slate-300/40" />
                        </div> */}
                        <div className={`size-6 shrink-0 rounded-md ${placeholder}`} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SongsListSkeleton;