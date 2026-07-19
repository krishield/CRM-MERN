import { useEffect, useState, useRef } from 'react';
import { Box, Paper, Typography, TextField, Button, Chip } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useSettings } from '../context/SettingsContext.jsx';
import { updateSettings, changePassword } from '../services/api.js';

const Settings = () => {
    const { settings, refreshSettings } = useSettings();
    const [crmName, setCrmName] = useState('');
    const [logo, setLogo] = useState('');
    const [idPrefix, setIdPrefix] = useState('');
    const [orderIdPrefix, setOrderIdPrefix] = useState('');
    const [deviceTypes, setDeviceTypes] = useState([]);
    const [newDevice, setNewDevice] = useState('');
    const [saved, setSaved] = useState(false);
    const fileInputRef = useRef(null);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);

    useEffect(() => {
        setCrmName(settings.crmName || '');
        setLogo(settings.logo || '');
        setIdPrefix(settings.idPrefix || '');
        setOrderIdPrefix(settings.orderIdPrefix || '');
        setDeviceTypes(settings.deviceTypes || []);
    }, [settings]);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setLogo(reader.result);
        reader.readAsDataURL(file);
    }

    const addDeviceType = () => {
        const value = newDevice.trim();
        if (!value || deviceTypes.includes(value)) return;
        setDeviceTypes([...deviceTypes, value]);
        setNewDevice('');
    }

    const removeDeviceType = (value) => {
        setDeviceTypes(deviceTypes.filter(d => d !== value));
    }

    const handleSave = async () => {
        await updateSettings({ crmName, logo, idPrefix, orderIdPrefix, deviceTypes });
        await refreshSettings();
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }

    const handlePasswordChange = async () => {
        setPasswordMessage('');
        if (newPassword !== confirmPassword) {
            setPasswordError(true);
            setPasswordMessage("New passwords don't match");
            return;
        }
        try {
            await changePassword(currentPassword, newPassword);
            setPasswordError(false);
            setPasswordMessage('Password updated');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setPasswordError(true);
            setPasswordMessage(error.response?.data?.message || 'Could not update password');
        }
    }

    return (
        <Box sx={{ p: 4, display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'flex-start' }}>
            <Paper sx={{ p: 3.5, borderRadius: 3, flex: '1 1 420px', maxWidth: 480 }}>
                <Typography sx={{ fontWeight: 'bold', color: '#0B2E4F', mb: 3 }}>Branding</Typography>

                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold', color: '#0B2E4F' }}>Logo</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box
                        component="img"
                        src={logo || `${process.env.PUBLIC_URL}/logo.png`}
                        alt="Logo preview"
                        sx={{ height: 56, width: 56, borderRadius: 2, objectFit: 'cover', border: '1px solid #E5E7EB' }}
                    />
                    <Button
                        variant="outlined"
                        startIcon={<UploadFileIcon />}
                        onClick={() => fileInputRef.current.click()}
                    >
                        Upload new logo
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleLogoChange}
                    />
                </Box>

                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold', color: '#0B2E4F' }}>CRM name</Typography>
                <TextField
                    fullWidth
                    value={crmName}
                    onChange={(e) => setCrmName(e.target.value)}
                    placeholder="Enter CRM name"
                    sx={{ mb: 3 }}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold', color: '#0B2E4F' }}>Customer ID prefix</Typography>
                        <TextField
                            value={idPrefix}
                            onChange={(e) => setIdPrefix(e.target.value.toUpperCase())}
                            placeholder="e.g. KD"
                            helperText={`e.g. ${idPrefix || 'KD'}001`}
                            sx={{ mb: 3, width: 160 }}
                        />
                    </Box>
                    <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold', color: '#0B2E4F' }}>Order ID prefix</Typography>
                        <TextField
                            value={orderIdPrefix}
                            onChange={(e) => setOrderIdPrefix(e.target.value.toUpperCase())}
                            placeholder="e.g. OD"
                            helperText={`e.g. ${orderIdPrefix || 'OD'}001`}
                            sx={{ mb: 3, width: 160 }}
                        />
                    </Box>
                </Box>

                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold', color: '#0B2E4F' }}>Device types</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                    {deviceTypes.map(d => (
                        <Chip key={d} label={d} onDelete={() => removeDeviceType(d)} />
                    ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                    <TextField
                        size="small"
                        value={newDevice}
                        onChange={(e) => setNewDevice(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addDeviceType()}
                        placeholder="Add a device type"
                        sx={{ flex: 1 }}
                    />
                    <Button variant="outlined" startIcon={<AddIcon />} onClick={addDeviceType}>Add</Button>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    sx={{ backgroundColor: '#0B2E4F', fontWeight: 'bold', borderRadius: 2 }}
                    onClick={handleSave}
                >
                    Save changes
                </Button>
                {saved && (
                    <Typography variant="body2" sx={{ color: '#16A34A', mt: 1.5 }}>Saved</Typography>
                )}
            </Paper>

            <Paper sx={{ p: 3.5, borderRadius: 3, flex: '1 1 320px', maxWidth: 480 }}>
                <Typography sx={{ fontWeight: 'bold', color: '#0B2E4F', mb: 3 }}>Reset password</Typography>

                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold', color: '#0B2E4F' }}>Current password</Typography>
                <TextField
                    fullWidth
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    sx={{ mb: 2.5 }}
                />

                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold', color: '#0B2E4F' }}>New password</Typography>
                <TextField
                    fullWidth
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    sx={{ mb: 2.5 }}
                />

                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold', color: '#0B2E4F' }}>Confirm new password</Typography>
                <TextField
                    fullWidth
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={{ mb: 3 }}
                />

                <Button
                    variant="contained"
                    startIcon={<LockResetIcon />}
                    sx={{ backgroundColor: '#0E9594', fontWeight: 'bold', borderRadius: 2 }}
                    onClick={handlePasswordChange}
                >
                    Update password
                </Button>
                {passwordMessage && (
                    <Typography variant="body2" sx={{ color: passwordError ? '#DC2626' : '#16A34A', mt: 1.5 }}>
                        {passwordMessage}
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default Settings;
