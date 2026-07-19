import { useEffect, useState, useRef } from 'react';
import { Box, Paper, Typography, TextField, Button } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SaveIcon from '@mui/icons-material/Save';
import { useSettings } from '../context/SettingsContext.jsx';
import { updateSettings } from '../services/api.js';

const Settings = () => {
    const { settings, refreshSettings } = useSettings();
    const [crmName, setCrmName] = useState('');
    const [logo, setLogo] = useState('');
    const [saved, setSaved] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        setCrmName(settings.crmName);
        setLogo(settings.logo);
    }, [settings]);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setLogo(reader.result);
        reader.readAsDataURL(file);
    }

    const handleSave = async () => {
        await updateSettings({ crmName, logo });
        await refreshSettings();
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }

    return (
        <Box sx={{ p: 4, maxWidth: 560 }}>
            <Paper sx={{ p: 3.5, borderRadius: 3 }}>
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
        </Box>
    );
};

export default Settings;
