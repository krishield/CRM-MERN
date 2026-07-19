import { useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import { SettingsProvider } from '../context/SettingsContext.jsx';

const Layout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:900px)');

    return (
        <SettingsProvider>
            <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F4F6F9' }}>
                {!isMobile && <Sidebar />}
                {isMobile && <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <Header onMenuClick={() => setMobileOpen(true)} showMenuButton={isMobile} />
                    <Box sx={{ flex: 1, overflowX: 'hidden' }}>
                        {children}
                    </Box>
                </Box>
            </Box>
        </SettingsProvider>
    );
};

export default Layout;
