import React from "react";
import Router from "./Router";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider, useTheme } from "./ThemeContext";
import "./App.css";
import ChatbotComponent from './chatbot'; 

function AppWrapper() {
    const { theme } = useTheme(); // Get the current theme object

    return (
        <div className="App" style={{ backgroundColor: theme.background, color: theme.color }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Router />
                <ChatbotComponent/>
            </LocalizationProvider>
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AppWrapper />
        </ThemeProvider>
    );
}

export default App;
