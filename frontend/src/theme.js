import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: { main: '#0B2E4F', light: '#1D4E7A', dark: '#071D33' },
        secondary: { main: '#0E9594', light: '#3CB7B5', dark: '#0A6E6D' },
        success: { main: '#16A34A' },
        warning: { main: '#D97706' },
        error: { main: '#DC2626' },
        info: { main: '#0E7490' },
        background: { default: '#F4F6F9', paper: '#FFFFFF' },
    },
    shape: { borderRadius: 10 },
});

export default theme;
