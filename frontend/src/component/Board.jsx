import { useEffect, useState } from 'react';
import { Box, Paper, Typography, Button, Chip, TextField, IconButton, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { getCustomers, changeStatus, markDelivered, editCustomer } from '../services/api.js';

const statusMessage = (c) => {
    switch (c.status) {
        case 'pending':
            return `Hi ${c.name}, we've received your ${c.device} for repair (${c.problem}). We'll update you once it's checked.`;
        case 'checked':
            return `Hi ${c.name}, we've checked your ${c.device}. Estimated cost: ₹${c.cost || 'TBD'}. We'll proceed with the repair.`;
        case 'completed':
            return `Hi ${c.name}, your ${c.device} repair is complete. Let us know if you'd like to collect it.`;
        case 'repaired':
            return `Hi ${c.name}, good news! Your ${c.device} has been repaired and is ready for pickup.`;
        case 'not-repaired':
            return `Hi ${c.name}, unfortunately we couldn't repair your ${c.device}. Please visit us to discuss or collect your device.`;
        default:
            return `Hi ${c.name}, regarding your ${c.device} at our shop.`;
    }
}

const whatsappLink = (c) => {
    const digits = String(c.mobile || '').replace(/\D/g, '');
    const withCountryCode = digits.length === 10 ? `91${digits}` : digits;
    const message = encodeURIComponent(statusMessage(c));
    return `https://wa.me/${withCountryCode}?text=${message}`;
}

const columns = [
    { status: 'pending', label: 'Pending', color: '#D97706' },
    { status: 'checked', label: 'Checked', color: '#0E9594' },
    { status: 'completed', label: 'Completed', color: '#0B2E4F' },
    { status: 'repaired', label: 'Repaired', color: '#16A34A' },
    { status: 'not-repaired', label: 'Not repaired', color: '#DC2626' },
];

const stamp = () => {
    const date = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', year: 'numeric'
    });
    const time = new Date().toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata', hour12: true, hour: 'numeric', minute: 'numeric'
    });
    return `${date} @ ${time}`;
}

const Board = () => {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        loadBoard();
    }, []);

    const loadBoard = async () => {
        const response = await getCustomers();
        setCustomers(response.data.filter(c => !c.delivered));
    }

    const move = async (id, newStatus) => {
        await changeStatus(id, newStatus);
        loadBoard();
    }

    const deliver = async (id) => {
        await markDelivered(id, stamp());
        loadBoard();
    }

    const saveNote = async (customer, note) => {
        if (note === (customer.note || '')) return;
        const { _id, __v, createdAt, updatedAt, ...rest } = customer;
        await editCustomer({ ...rest, note }, _id);
        loadBoard();
    }

    return (
        <Box sx={{ display: 'flex', gap: 2, p: { xs: 1.5, sm: 3 }, overflowX: 'auto' }}>
            {columns.map(col => {
                const cards = customers.filter(c => c.status === col.status);
                return (
                    <Box key={col.status} sx={{ minWidth: 260, flex: '1 0 260px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#0B2E4F' }}>
                                {col.label}
                            </Typography>
                            <Chip size="small" label={cards.length} sx={{ backgroundColor: col.color, color: '#fff', fontWeight: 'bold' }} />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {cards.length === 0 && (
                                <Typography variant="body2" sx={{ color: '#888780', fontStyle: 'italic' }}>
                                    Nothing here
                                </Typography>
                            )}
                            {cards.map(c => (
                                <Paper key={c._id} sx={{ p: 1.5, borderRadius: 2, borderLeft: `4px solid ${col.color}` }}>
                                    <Typography sx={{ fontWeight: 'bold', color: '#0B2E4F' }}>
                                        {c.customerId} &middot; {c.device} &middot; {c.brand}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#5F5E5A', fontWeight: 'bold' }}>{c.name} &nbsp; {c.mobile}</Typography>
                                    <Box sx={{ backgroundColor: '#FAEEDA', borderRadius: 1, p: 0.75, mb: 0.75 }}>
                                        <Typography variant="body2" sx={{ color: '#2C2C2A', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                            {c.problem}
                                        </Typography>
                                    </Box>
                                    {c.cost && (
                                        <Chip
                                            size="small"
                                            label={`₹${c.cost}`}
                                            sx={{ backgroundColor: '#E1F5EE', color: '#085041', fontWeight: 'bold', mb: 0.75 }}
                                        />
                                    )}
                                    <TextField
                                        defaultValue={c.note || ''}
                                        key={`${c._id}-${c.note || ''}`}
                                        onBlur={(e) => saveNote(c, e.target.value)}
                                        placeholder="Add a note..."
                                        variant="standard"
                                        multiline
                                        fullWidth
                                        size="small"
                                        sx={{ mb: 1, '& .MuiInputBase-input': { fontSize: 13, fontStyle: 'italic', color: '#5F5E5A' } }}
                                    />

                                    {col.status === 'pending' && (
                                        <Button fullWidth size="small" variant="contained" sx={{ backgroundColor: '#0E9594' }} onClick={() => move(c._id, 'checked')}>
                                            Check
                                        </Button>
                                    )}

                                    {col.status === 'checked' && (
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button size="small" variant="outlined" onClick={() => move(c._id, 'pending')}>Back</Button>
                                            <Button fullWidth size="small" variant="contained" sx={{ backgroundColor: '#0B2E4F' }} onClick={() => move(c._id, 'completed')}>
                                                Complete
                                            </Button>
                                        </Box>
                                    )}

                                    {col.status === 'completed' && (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button fullWidth size="small" variant="contained" sx={{ backgroundColor: '#16A34A' }} onClick={() => move(c._id, 'repaired')}>
                                                    Repaired
                                                </Button>
                                                <Button fullWidth size="small" variant="contained" sx={{ backgroundColor: '#DC2626' }} onClick={() => move(c._id, 'not-repaired')}>
                                                    Not repaired
                                                </Button>
                                            </Box>
                                            <Button size="small" variant="outlined" onClick={() => move(c._id, 'checked')}>Back to checked</Button>
                                        </Box>
                                    )}

                                    {(col.status === 'repaired' || col.status === 'not-repaired') && (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <Button fullWidth size="small" variant="contained" sx={{ backgroundColor: '#0B2E4F' }} onClick={() => deliver(c._id)}>
                                                Delivered
                                            </Button>
                                            <Button size="small" variant="outlined" onClick={() => move(c._id, 'completed')}>Back to completed</Button>
                                        </Box>
                                    )}

                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                        <Button component={Link} to={`/edit/${c._id}`} size="small" sx={{ fontSize: 12 }}>
                                            Edit details
                                        </Button>
                                        <Tooltip title="Message on WhatsApp">
                                            <IconButton
                                                size="small"
                                                component="a"
                                                href={whatsappLink(c)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{ color: '#25D366' }}
                                            >
                                                <WhatsAppIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
}

export default Board;
