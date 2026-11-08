// src/components/Button/ThemeToggleButton.jsx
import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeMode } from '../../contexts/ThemeModeContext'; // Ajuste o caminho se necessário

export default function ThemeToggleButton() {
    // Consome o contexto global que você já criou
    const { mode, toggleColorMode } = useThemeMode();

    return (
        <Tooltip title={mode === 'dark' ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}>
            <IconButton 
                onClick={toggleColorMode} 
                sx={{
                    transition: 'all 0.3s ease',
                    // Um pequeno efeito de hover para ficar premium
                    '&:hover': {
                        transform: 'rotate(15deg) scale(1.1)',
                    }
                }}
            >
                {mode === 'dark' ? (
                    // Ícone de Sol amarelinho quando estiver escuro
                    <LightModeIcon sx={{ color: '#fbbf24', fontSize: 28 }} /> 
                ) : (
                    // Ícone de Lua escuro quando estiver claro
                    <DarkModeIcon sx={{ color: '#1e293b', fontSize: 28 }} />
                )}
            </IconButton>
        </Tooltip>
    );
}