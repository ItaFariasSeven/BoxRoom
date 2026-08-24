import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Importações da Fonte Roboto
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Importações do Tema e do Provedor do MUI
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* O ThemeProvider injeta as cores no sistema */}
    <ThemeProvider theme={theme}>
      {/* O CssBaseline limpa as margens padrão do navegador e aplica a cor de fundo do tema */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);