import React from "react";

interface SongsSearchEmptyStateProps {
    onClearSearch: () => void;
}

const SongNotFoundLst: React.FC<SongsSearchEmptyStateProps> = ({
    onClearSearch,
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">

            {/* Search icon */}
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-slate-200/70 text-slate-500 dark:bg-slate-700/60 dark:text-slate-300">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="size-8"
                    aria-hidden="true"
                >
                    <circle cx="11" cy="11" r="7" />
                    <path strokeLinecap="round" d="m16 16 4 4" />
                </svg>
            </div>

            {/* Message */}
            <h2 className="text-lg font-semibold text-[#304B68] dark:text-[#E3EEF4]">
                No songs found
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#59799F] dark:text-slate-400">
                We couldn't find any songs matching your search. Try another song number or title.
            </p>

            {/* Clear search */}
            <button
                type="button"
                onClick={onClearSearch}
                className="mt-5 rounded-full bg-[#397A9A] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#306A87] active:scale-95"
            >
                Clear search
            </button>
        </div>
    );
};

export default SongNotFoundLst;