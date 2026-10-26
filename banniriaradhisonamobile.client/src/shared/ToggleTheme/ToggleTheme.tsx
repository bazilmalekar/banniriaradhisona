import { useTheme } from "../../contexts/ThemeContext";

const ThemeToggle = () => {
    const { isDarkMode, setIsDarkMode } = useTheme();

    return (
        <label
            className="relative inline-flex cursor-pointer items-center"
            aria-label="Toggle theme"
        >
            <input
                type="checkbox"
                checked={isDarkMode}
                onChange={(event) =>
                    setIsDarkMode(event.target.checked)
                }
                className="peer sr-only"
                aria-label="Enable dark mode"
            />

            {/* Track */}
            <span className="
                h-10 w-[76px] rounded-full p-1
                transition-colors duration-300
                bg-emerald-100
                peer-checked:bg-slate-800
                peer-focus-visible:outline-2
                peer-focus-visible:outline-offset-2
                peer-focus-visible:outline-blue-500
            "/>

            {/* Sliding thumb */}
            <span
                className="
          absolute left-1 top-1
          flex h-8 w-8 items-center justify-center
          rounded-full bg-white shadow-md
          transform transition-transform duration-300 ease-in-out
          peer-checked:translate-x-9
        "
            >
                {isDarkMode ? (
                    /* Moon icon */
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        className="text-slate-800"
                        aria-hidden="true"
                    >
                        <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.597 0 1.17-.071 1.709-.207a.757.757 0 0 1 .83.284.764.764 0 0 1-.09.965A8.005 8.005 0 0 1 8 15.5C3.582 15.5 0 11.918 0 7.5 0 4.234 1.95 1.424 4.714.257A.752.752 0 0 1 6 .278" />
                    </svg>
                ) : (
                    /* Sun icon */
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        className="text-emerald-600"
                        aria-hidden="true"
                    >
                        <path d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8" />
                        <path d="M8 0a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 8 0m0 14a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5M3.05 3.05a.5.5 0 0 1 .707 0l.707.707a.5.5 0 1 1-.707.707l-.707-.707a.5.5 0 0 1 0-.707m8.486 8.486a.5.5 0 0 1 .707 0l.707.707a.5.5 0 0 1-.707.707l-.707-.707a.5.5 0 0 1 0-.707M0 8a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1A.5.5 0 0 1 0 8m14 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5M3.05 12.95a.5.5 0 0 1 0-.707l.707-.707a.5.5 0 1 1 .707.707l-.707.707a.5.5 0 0 1-.707 0m8.486-8.486a.5.5 0 0 1 0-.707l.707-.707a.5.5 0 1 1 .707.707l-.707.707a.5.5 0 0 1-.707 0" />
                    </svg>
                )}
            </span>
        </label>
    );
};

export default ThemeToggle;
