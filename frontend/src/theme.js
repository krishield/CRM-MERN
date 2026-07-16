import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: { main: '#054F81' },
        secondary: { main: '#2E7D32' },
        background: { default: '#f5f7fa' },
    },
    shape: { borderRadius: 8 },
});

export default theme;
