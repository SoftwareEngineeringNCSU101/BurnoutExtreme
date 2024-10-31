import React, { createContext, useContext, useState, useEffect } from 'react';
import themes from './theme'; 

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const savedTheme = localStorage.getItem('themeName') || 'sunnyDay';
    const [themeName, setThemeName] = useState(savedTheme);

    useEffect(() => {
        localStorage.setItem('themeName', themeName);
    }, [themeName]);

    const toggleTheme = (name) => {
        setThemeName(name);
    };

    const theme = themes[themeName];

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, themeName }}> {/* Include themeName here */}
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
