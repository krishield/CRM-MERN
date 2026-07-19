import { Box } from '@mui/material';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

const Layout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F4F6F9' }}>
            <Sidebar />
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Header />
                <Box sx={{ flex: 1 }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;
