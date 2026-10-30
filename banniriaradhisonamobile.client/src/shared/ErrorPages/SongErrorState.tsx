import React from "react";

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

const SongErrorState: React.FC<ErrorStateProps> = ({ title = "Something went wrong", message = "We couldn't complete your request. Please try again.", onRetry }) => {
    return (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center">
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
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v4m0 4h.01M10.3 3.86 2.8 17a2 2 0 0 0 1.74 3h14.92a2 2 0 0 0 1.74-3l-7.46-13.14a2 2 0 0 0-3.44 0Z"
                    />
                </svg>
            </div>
            {/* Error message */}
            <h2 className="text-lg font-semibold text-[#304B68] dark:text-[#E3EEF4]">{title}</h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#59799F] dark:text-slate-400">{message}</p>
            {/* Retry button */}
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-5 rounded-full bg-[#397A9A] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#306A87] active:scale-95"
                >
                    Try again
                </button>
            )}
        </div>
    );
};

export default SongErrorState;
