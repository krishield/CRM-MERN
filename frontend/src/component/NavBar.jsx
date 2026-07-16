import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Tabs, Tab, IconButton, Tooltip, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const tabs = [
  { label: 'Add Customer', to: '/' },
  { label: 'Pending', to: '/pending' },
  { label: 'Checked', to: '/checked' },
  { label: 'Completed', to: '/completed' },
  { label: 'All Customers', to: '/all' },
  { label: 'Orders', to: '/orders' },
  { label: 'All Orders', to: '/Allorders' },
];

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = tabs.some(t => t.to === location.pathname) ? location.pathname : false;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (location.pathname === '/login') {
    return null;
  }

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box
          component={NavLink}
          to="/"
          sx={{ display: 'flex', alignItems: 'center', mr: 2, flexShrink: 0 }}
        >
          <Box component="img" src={`${process.env.PUBLIC_URL}/logo.png`} alt="KD" sx={{ height: 40, borderRadius: 1 }} />
        </Box>
        <Tabs
          value={currentTab}
          textColor="inherit"
          indicatorColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map(tab => (
            <Tab key={tab.to} label={tab.label} value={tab.to} to={tab.to} component={NavLink} />
          ))}
        </Tabs>
        <Tooltip title="Logout">
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
