// src/contexts/ThemeModeContext.jsx
import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeModeContext = createContext();

export function ThemeModeProvider({ children }) {
    const [mode, setMode] = useState('light');

    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', mode);
    }, [mode]);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: mode,
                    // Opcional: Defina cores de fundo personalizadas para o modo escuro do MUI
                    ...(mode === 'dark'
                        ? {
                              background: {
                                  default: '#0f172a', // O fundo geral da página no modo escuro
                                  paper: '#1e293b',   // O fundo de cards/modais no modo escuro
                              },
                          }
                        : {
                              background: {
                                  default: '#f8fafc', // O fundo geral no modo claro
                                  paper: '#ffffff',   // O fundo de cards/modais no modo claro
                              },
                          }),
                },
            }),
        [mode]
    );

    return (
        <ThemeModeContext.Provider value={{ mode, toggleColorMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeModeContext.Provider>
    );
}

export const useThemeMode = () => useContext(ThemeModeContext);