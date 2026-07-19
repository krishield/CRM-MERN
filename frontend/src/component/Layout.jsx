import { useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import OwnerPinDialog from './OwnerPinDialog.jsx';
import { SettingsProvider } from '../context/SettingsContext.jsx';
import { OwnerLockProvider } from '../context/OwnerLockContext.jsx';

const Layout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:900px)');

    return (
        <SettingsProvider>
            <OwnerLockProvider>
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
                <OwnerPinDialog />
            </OwnerLockProvider>
        </SettingsProvider>
    );
};

export default Layout;
