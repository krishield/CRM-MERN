import { NavLink, useNavigate } from 'react-router-dom';
import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, Divider, Drawer, useMediaQuery } from '@mui/material';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PaidIcon from '@mui/icons-material/Paid';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useSettings } from '../context/SettingsContext.jsx';
import { useOwnerLock } from '../context/OwnerLockContext.jsx';

const topItems = [
    { label: 'Add new', to: '/add', icon: <AddCircleIcon /> },
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

const Sidebar = ({ mobileOpen, onClose }) => {
    const navigate = useNavigate();
    const { settings } = useSettings();
    const { unlocked, openDialog, lock } = useOwnerLock();
    const isMobile = useMediaQuery('(max-width:900px)');

    const unlockedItems = [
        { label: 'Dashboard', to: '/dashboard', icon: <SpaceDashboardIcon /> },
        ...(settings.ordersEnabled !== false ? [{ label: 'Orders', to: '/orders', icon: <ShoppingBagIcon /> }] : []),
    ];

    const adminItems = [
        ...(settings.ordersEnabled !== false ? [{ label: 'Orders (all orders)', to: '/Allorders', icon: <ShoppingBagIcon /> }] : []),
        { label: 'Customers', to: '/all', icon: <PeopleAltIcon /> },
        { label: 'Revenue', to: '/revenue', icon: <PaidIcon /> },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        lock();
        navigate('/login');
    };

    const handleNavClick = () => {
        if (isMobile && onClose) onClose();
    };

    const handleAdminClick = () => {
        if (unlocked) {
            lock();
        } else {
            openDialog();
        }
        if (isMobile && onClose) onClose();
    };

    const content = (
        <Box sx={{
            width: 240,
            flexShrink: 0,
            backgroundColor: '#0B2E4F',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
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
                    <ListItemButton key={item.to} component={NavLink} to={item.to} onClick={handleNavClick} sx={navSx}>
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                ))}
            </List>

            <Box sx={{ height: 16 }} />

            <List sx={{ px: 1.5 }}>
                {unlockedItems.map(item => (
                    <ListItemButton key={item.to} component={NavLink} to={item.to} onClick={handleNavClick} sx={navSx}>
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                ))}
            </List>

            <Box sx={{ height: 16 }} />

            <List sx={{ px: 1.5, flex: 1 }}>
                <ListItemButton onClick={handleAdminClick} sx={navSx}>
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                        {unlocked ? <LockOpenIcon /> : <LockIcon />}
                    </ListItemIcon>
                    <ListItemText primary={unlocked ? 'Admin (unlocked)' : 'Admin'} />
                </ListItemButton>
                <Box sx={{ pl: 2 }}>
                    {adminItems.map(item => (
                        <ListItemButton key={item.to} component={NavLink} to={item.to} onClick={handleNavClick} sx={{ ...navSx, py: 0.5 }}>
                            <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14 }} />
                        </ListItemButton>
                    ))}
                </Box>
            </List>

            <List sx={{ px: 1.5 }}>
                <ListItemButton component={NavLink} to="/settings" onClick={handleNavClick} sx={navSx}>
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

    if (isMobile) {
        return (
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onClose}
                ModalProps={{ keepMounted: true }}
                sx={{ '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' } }}
            >
                {content}
            </Drawer>
        );
    }

    return (
        <Box sx={{ position: 'sticky', top: 0, height: '100vh' }}>
            {content}
        </Box>
    );
};

export default Sidebar;
