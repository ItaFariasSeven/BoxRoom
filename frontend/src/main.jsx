import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx';
import NavBar from './components/NavBar/NavBar.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Importações da Fonte Roboto
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Importações do Tema e do Provedor do MUI
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {

      // Durante 30 segundos consideramos os dados recentes.
      staleTime: 30000,

      // Tenta novamente uma vez em caso de falha.
      retry: 1,

      // Evita refetch desnecessário ao trocar de janela.
      refetchOnWindowFocus: false,
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <ThemeProvider theme={theme}>
      {/* <NavBar /> */}
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);