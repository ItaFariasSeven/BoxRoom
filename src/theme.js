import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Azul padrão 
    },
    secondary: {
      main: '#dc004e', // Cor de destaque (rosa/vermelho)
    },
    background: {
      default: '#f4f6f8', // Fundo cinza claro para a página
    },
  },
});

export default theme;