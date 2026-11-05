// src/contexts/ViewModeContext.jsx
import React, { createContext, useState, useContext } from 'react';

const ViewModeContext = createContext();

export function ViewModeProvider({ children }) {
    // Começa com visão de grid (tradicional)
    const [viewMode, setViewMode] = useState('grid'); 

    const toggleViewMode = () => {
        setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'));
    };

    return (
        <ViewModeContext.Provider value={{ viewMode, toggleViewMode }}>
            {children}
        </ViewModeContext.Provider>
    );
}

// Hook personalizado para facilitar o uso
export function useViewMode() {
    return useContext(ViewModeContext);
}
