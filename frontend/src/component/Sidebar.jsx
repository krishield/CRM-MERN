import { NavLink, useNavigate } from 'react-router-dom';
import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';

const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: <SpaceDashboardIcon /> },
    { label: 'Customers', to: '/all', icon: <PeopleAltIcon /> },
    { label: 'Orders', to: '/Allorders', icon: <ShoppingBagIcon /> },
    { label: 'Add new', to: '/add', icon: <AddCircleIcon /> },
];

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <Box sx={{
            width: 240,
            flexShrink: 0,
            backgroundColor: '#0B2E4F',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            position: 'sticky',
            top: 0,
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 3 }}>
                <Box component="img" src={`${process.env.PUBLIC_URL}/logo.png`} alt="KD" sx={{ height: 36, borderRadius: 1 }} />
                <Box>
                    <Typography sx={{ fontWeight: 'bold', lineHeight: 1.1 }}>KD CRM</Typography>
                    <Typography sx={{ fontSize: 11, color: '#B5D4F4', letterSpacing: 1 }}>SHOP SYSTEM</Typography>
                </Box>
            </Box>

            <List sx={{ px: 1.5, flex: 1 }}>
                {navItems.map(item => (
                    <ListItemButton
                        key={item.to}
                        component={NavLink}
                        to={item.to}
                        sx={{
                            borderRadius: 2,
                            mb: 0.5,
                            color: '#CEDCEA',
                            '&.active': {
                                backgroundColor: '#1D4E7A',
                                color: '#fff',
                            },
                            '&:hover': { backgroundColor: '#173F63' },
                        }}
                    >
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                ))}
            </List>

            <ListItemButton onClick={handleLogout} sx={{ mx: 1.5, mb: 2, borderRadius: 2, color: '#CEDCEA', '&:hover': { backgroundColor: '#173F63' } }}>
                <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Logout" />
            </ListItemButton>
        </Box>
    );
};

export default Sidebar;
