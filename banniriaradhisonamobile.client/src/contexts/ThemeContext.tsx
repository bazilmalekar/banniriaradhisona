
import React, { useState, useEffect, createContext, useContext } from "react";

export interface IThemeContext {
    isDarkMode: boolean;
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IThemeContextProvider {
    children: React.ReactNode;
}

export const ThemeContext = createContext<IThemeContext>({
    isDarkMode: false,
    setIsDarkMode: () => { },
});

export const useTheme = () => useContext(ThemeContext);

const ThemeContextProvider = ({ children, }: IThemeContextProvider) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === "dark";
    });

    const theme = isDarkMode ? "dark" : "light";

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContextProvider;
