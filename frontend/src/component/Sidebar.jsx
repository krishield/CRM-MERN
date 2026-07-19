import { NavLink, useNavigate } from 'react-router-dom';
import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PaidIcon from '@mui/icons-material/Paid';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSettings } from '../context/SettingsContext.jsx';

const topItems = [
    { label: 'Add new', to: '/add', icon: <AddCircleIcon /> },
];

const mainItems = [
    { label: 'Dashboard', to: '/dashboard', icon: <SpaceDashboardIcon /> },
    { label: 'Orders', to: '/Allorders', icon: <ShoppingBagIcon /> },
    { label: 'Customers', to: '/all', icon: <PeopleAltIcon /> },
    { label: 'Revenue', to: '/revenue', icon: <PaidIcon /> },
];

const navSx = {
    borderRadius: 2,
    mb: 0.5,
    color: '#CEDCEA',
    '&.active': {
        backgroundColor: '#1D4E7A',
        color: '#fff',
    },
    '&:hover': { backgroundColor: '#173F63' },
};

const Sidebar = () => {
    const navigate = useNavigate();
    const { settings } = useSettings();

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
                <Box
                    component="img"
                    src={settings.logo || `${process.env.PUBLIC_URL}/logo.png`}
                    alt={settings.crmName}
                    sx={{ height: 36, borderRadius: 1 }}
                />
                <Box>
                    <Typography sx={{ fontWeight: 'bold', lineHeight: 1.1 }}>{settings.crmName}</Typography>
                    <Typography sx={{ fontSize: 11, color: '#B5D4F4', letterSpacing: 1 }}>SHOP SYSTEM</Typography>
                </Box>
            </Box>

            <List sx={{ px: 1.5 }}>
                {topItems.map(item => (
                    <ListItemButton key={item.to} component={NavLink} to={item.to} sx={navSx}>
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                ))}
            </List>

            <Box sx={{ height: 16 }} />

            <List sx={{ px: 1.5, flex: 1 }}>
                {mainItems.map(item => (
                    <ListItemButton key={item.to} component={NavLink} to={item.to} sx={navSx}>
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                ))}
            </List>

            <List sx={{ px: 1.5 }}>
                <ListItemButton component={NavLink} to="/settings" sx={navSx}>
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}><SettingsIcon /></ListItemIcon>
                    <ListItemText primary="Settings" />
                </ListItemButton>
            </List>

            <Divider sx={{ borderColor: '#173F63', mx: 1.5 }} />

            <Box sx={{ p: 1.5 }}>
                <ListItemButton
                    onClick={handleLogout}
                    sx={{
                        borderRadius: 2,
                        color: '#CEDCEA',
                        py: 0.5,
                        justifyContent: 'flex-start',
                        '&:hover': { backgroundColor: '#173F63' },
                    }}
                >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 30 }}><LogoutIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 13 }} />
                </ListItemButton>
            </Box>
        </Box>
    );
};

export default Sidebar;
