import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';
import { useOwnerLock } from '../context/OwnerLockContext.jsx';

const OwnerPinDialog = () => {
    const { dialogOpen, closeDialog, unlock } = useOwnerLock();
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handleClose = () => {
        setPin('');
        setError('');
        closeDialog();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await unlock(pin);
            setPin('');
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Incorrect PIN');
        }
    }

    return (
        <Dialog open={dialogOpen} onClose={handleClose}>
            <form onSubmit={handleSubmit}>
                <DialogTitle>Enter owner PIN</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ color: '#5F5E5A', mb: 2 }}>
                        Customers and Revenue are locked. Enter the owner PIN to view them.
                    </Typography>
                    <TextField
                        autoFocus
                        fullWidth
                        type="password"
                        inputMode="numeric"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        error={!!error}
                        helperText={error}
                        placeholder="PIN"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="contained" sx={{ backgroundColor: '#0B2E4F' }}>Unlock</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default OwnerPinDialog;
