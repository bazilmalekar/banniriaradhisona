import React from "react";
import { NavLink } from "react-router";
import "./AppHeadder.css";

const AppHeadder: React.FC = () => {
    return (
        <header
            className="
        app-header relative flex w-full shrink-0 items-center
        justify-between rounded-b-[2.5rem] px-5
        pt-[calc(env(safe-area-inset-top,0px)+2rem)]
        pb-3
        shadow-[0_4px_12px_rgba(48,75,104,0.10)]
    "
        >
            {/* App branding */}
            <NavLink to="/" className="flex flex-col no-underline">
                <span className="text-2xl font-bold tracking-tight text-foreground">Aradhisuva</span>
            </NavLink>
            <div className="flex items-center gap-2">
                <NavLink
                    to="/songs"
                    aria-label="Search songs"
                    className="flex size-10 items-center justify-center rounded-full border border-foreground/10 bg-surface/80 text-foreground shadow-sm transition hover:bg-surface">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-4-4" />
                    </svg>
                </NavLink>

                <NavLink
                    to="/setting"
                    aria-label="Settings"
                    className="flex size-10 items-center justify-center rounded-full border border-foreground/10 bg-surface/80 text-foreground shadow-sm transition hover:bg-surface"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                    </svg>
                </NavLink>
            </div>
        </header>
    );
};

export default AppHeadder;