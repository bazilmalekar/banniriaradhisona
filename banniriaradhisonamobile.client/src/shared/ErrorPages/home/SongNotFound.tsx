import React from "react";
import { useNavigate } from "react-router";

const SongNotFound: React.FC = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        localStorage.removeItem("ara");
        navigate("/");
    }

    return (
        <div className="flex min-h-0 flex-1 items-center justify-center px-6">
            <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/40 px-7 py-10 text-center shadow-[0_8px_28px_rgba(57,122,154,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-[#1C303B]/45">
                <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-[#E3F0EE] text-[#397A9A] shadow-inner dark:bg-[#294750] dark:text-[#B5CEDC]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-10"
                        aria-hidden="true"
                    >
                        <path d="M9 18V5l12-2v13" />
                        <circle cx="6" cy="18" r="3" />
                        <circle cx="18" cy="16" r="3" />
                        <path d="M9 8l12-2" />
                    </svg>
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-[#304B68] dark:text-[#E3EEF4]">Song not found</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#668097] dark:text-[#B5C8D3]">
                    We couldn't find the song you're looking for. It may have been removed or the song number may be incorrect.
                </p>
                <button type="button" onClick={handleClick} className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-[#397A9A] px-6 py-3 text-sm font-medium text-white shadow-[0_4px_12px_rgba(57,122,154,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#326D8B] hover:shadow-[0_7px_16px_rgba(57,122,154,0.28)] active:translate-y-0 active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                    </svg>
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default SongNotFound;