import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Badge, IconButton, Tooltip } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import { getCustomers } from '../services/api.js';
import { getCurrentUser } from '../utils/auth.js';

const pageInfo = {
    '/dashboard': { title: 'Dashboard', subtitle: 'Ongoing repairs at a glance' },
    '/all': { title: 'Customers', subtitle: 'All customer records' },
    '/Allorders': { title: 'All orders', subtitle: 'All customer orders' },
    '/orders': { title: 'Orders', subtitle: 'Orders awaiting completion' },
    '/add': { title: 'Add new entry', subtitle: 'Add new customer and order details' },
    '/settings': { title: 'Settings', subtitle: 'Customize your CRM' },
    '/revenue': { title: 'Revenue', subtitle: 'Earnings from repaired and delivered devices' },
};

const initials = (name) => {
    if (!name) return '?';
    return name.slice(0, 2).toUpperCase();
}

const Header = ({ onMenuClick, showMenuButton }) => {
    const location = useLocation();
    const [pendingCount, setPendingCount] = useState(0);
    const username = getCurrentUser();

    useEffect(() => {
        const loadCount = async () => {
            const response = await getCustomers();
            setPendingCount(response.data.filter(c => c.status === 'pending').length);
        }
        loadCount();
    }, [location.pathname]);

    const info = pageInfo[location.pathname] || { title: '', subtitle: '' };

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: { xs: 2, sm: 4 },
            py: { xs: 1.5, sm: 2.5 },
            backgroundColor: '#fff',
            borderBottom: '1px solid #E5E7EB',
            gap: 1,
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                {showMenuButton && (
                    <IconButton onClick={onMenuClick} sx={{ color: '#0B2E4F' }}>
                        <MenuIcon />
                    </IconButton>
                )}
                <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#0B2E4F', fontSize: { xs: 18, sm: 24 } }} noWrap>{info.title}</Typography>
                    <Typography variant="body2" sx={{ color: '#5F5E5A', display: { xs: 'none', sm: 'block' } }}>{info.subtitle}</Typography>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2.5 } }}>
                <Tooltip title={`${pendingCount} pending repair${pendingCount === 1 ? '' : 's'}`}>
                    <IconButton>
                        <Badge badgeContent={pendingCount} color="warning">
                            <NotificationsIcon sx={{ color: '#0B2E4F' }} />
                        </Badge>
                    </IconButton>
                </Tooltip>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                        width: 40, height: 40, borderRadius: '50%',
                        backgroundColor: '#0E9594', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 'bold', fontSize: 14, flexShrink: 0,
                    }}>
                        {initials(username)}
                    </Box>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: 14, color: '#0B2E4F', lineHeight: 1.2 }}>{username || 'User'}</Typography>
                        <Typography sx={{ fontSize: 12, color: '#888780' }}>Admin</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Header;
