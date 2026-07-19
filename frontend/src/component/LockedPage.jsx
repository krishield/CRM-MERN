import { Box, Typography, Button } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useOwnerLock } from '../context/OwnerLockContext.jsx';

const LockedPage = ({ children }) => {
    const { unlocked, openDialog } = useOwnerLock();

    if (unlocked) return children;

    return (
        <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: '60vh', textAlign: 'center', p: 4,
        }}>
            <Box sx={{
                width: 64, height: 64, borderRadius: '50%', backgroundColor: '#0B2E4F',
                display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2,
            }}>
                <LockIcon sx={{ color: '#fff', fontSize: 32 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0B2E4F', mb: 1 }}>This page is locked</Typography>
            <Typography variant="body2" sx={{ color: '#5F5E5A', mb: 3, maxWidth: 320 }}>
                Only the owner can view this. Enter the owner PIN to continue.
            </Typography>
            <Button variant="contained" sx={{ backgroundColor: '#0B2E4F' }} onClick={openDialog}>
                Enter PIN
            </Button>
        </Box>
    );
};

export default LockedPage;
