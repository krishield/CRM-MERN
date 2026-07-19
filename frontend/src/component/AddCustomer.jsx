import { useState } from "react";
import {
    Box, Paper, Typography, Button, Select, MenuItem, TextField,
    InputAdornment, Grid
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import BuildIcon from '@mui/icons-material/Build';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DescriptionIcon from '@mui/icons-material/Description';
import DevicesIcon from '@mui/icons-material/Devices';
import LabelIcon from '@mui/icons-material/Label';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { addCustomer, addOrder } from "../services/api.js";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext.jsx";

const defaultValue = {
    device: '--',
    brand: '--',
    name: '--',
    mobile: '--',
    problem: '--',
    cost: '',
    note: '--',
    date: "--",
    time: "--",
    status: 'pending',
    time2: '',
    productDetails: '--',
    totalAmount: '',
    advanceAmount: '',
}

const SectionHeader = ({ icon, color, label }) => (
    <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
                width: 40, height: 40, borderRadius: '50%', backgroundColor: color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
            }}>
                {icon}
            </Box>
            <Typography sx={{ fontWeight: 'bold', color: '#0B2E4F', letterSpacing: 1 }}>{label}</Typography>
        </Box>
        <Box sx={{ width: 48, height: 3, backgroundColor: color, borderRadius: 2, mt: 1, ml: '52px' }} />
    </Box>
);

const AddCustomer = () => {
    const [customer, setCustomer] = useState(defaultValue);
    const [order, setOrder] = useState(defaultValue);
    const [costError, setCostError] = useState('');
    const [amountError, setAmountError] = useState('');
    const nevigate = useNavigate();
    const { settings } = useSettings();
    const deviceTypes = settings.deviceTypes && settings.deviceTypes.length ? settings.deviceTypes : ['Laptop', 'Desktop', 'Mobile', 'Tablet', 'Printer'];

    const onValueChange = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value })
        setOrder({ ...order, [e.target.name]: e.target.value })
    }

    const isValidAmount = (value) => value === '' || (!isNaN(value) && Number(value) >= 0);

    const addCustomerDetails = async () => {
        if (!isValidAmount(customer.cost)) {
            setCostError('Cost must be a number');
            return;
        }
        setCostError('');
        const currentTime = new Date().toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata', hour12: true, hour: 'numeric', minute: 'numeric'
        });
        const currentDate = new Date().toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', year: 'numeric'
        });
        const payload = { ...customer, time: currentTime, date: currentDate };
        if (payload.cost === '') delete payload.cost; else payload.cost = Number(payload.cost);
        await addCustomer(payload);
        nevigate('/dashboard')
    }

    const addOrderDetails = async () => {
        if (!isValidAmount(order.totalAmount) || !isValidAmount(order.advanceAmount)) {
            setAmountError('Amounts must be numbers');
            return;
        }
        setAmountError('');
        const currentTime = new Date().toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata', hour12: true, hour: 'numeric', minute: 'numeric'
        });
        const currentDate = new Date().toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', year: 'numeric'
        });
        const payload = { ...order, time: currentTime, date: currentDate };
        if (payload.totalAmount === '') delete payload.totalAmount; else payload.totalAmount = Number(payload.totalAmount);
        if (payload.advanceAmount === '') delete payload.advanceAmount; else payload.advanceAmount = Number(payload.advanceAmount);
        await addOrder(payload);
        nevigate('/orders')
    }

    return (
        <Box sx={{ p: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3.5, borderRadius: 3 }}>
                        <SectionHeader icon={<PersonIcon />} color="#185FA5" label="NEW CUSTOMER" />

                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold', color: '#0B2E4F' }}>Select type</Typography>
                        <Select
                            fullWidth
                            defaultValue='device'
                            onChange={(e) => onValueChange(e)}
                            name='device'
                            startAdornment={<InputAdornment position="start"><DevicesIcon sx={{ color: '#888780' }} /></InputAdornment>}
                            sx={{ mb: 2.5 }}
                        >
                            <MenuItem value='device' disabled>Select type</MenuItem>
                            {deviceTypes.map(d => (
                                <MenuItem key={d} value={d}>{d}</MenuItem>
                            ))}
                        </Select>

                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold', color: '#0B2E4F' }}>Brand / model</Typography>
                        <TextField
                            fullWidth placeholder="Enter brand or model" name='brand' onChange={onValueChange}
                            InputProps={{ startAdornment: <InputAdornment position="start"><LabelIcon sx={{ color: '#888780' }} /></InputAdornment> }}
                            sx={{ mb: 2.5 }}
                        />

                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold', color: '#0B2E4F' }}>Customer name</Typography>
                        <TextField
                            fullWidth placeholder="Enter customer name" name='name' onChange={onValueChange}
                            InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#888780' }} /></InputAdornment> }}
                            sx={{ mb: 2.5 }}
                        />

                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold', color: '#0B2E4F' }}>Mobile no.</Typography>
                        <TextField
                            fullWidth placeholder="Enter mobile number" name='mobile' onChange={onValueChange}
                            InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: '#888780' }} /></InputAdornment> }}
                            sx={{ mb: 2.5 }}
                        />

                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold', color: '#0B2E4F' }}>Problem</Typography>
                        <TextField
                            fullWidth placeholder="Describe the problem" name='problem' onChange={onValueChange}
                            InputProps={{ startAdornment: <InputAdornment position="start"><BuildIcon sx={{ color: '#888780' }} /></InputAdornment> }}
                            sx={{ mb: 2.5 }}
                        />

                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold', color: '#0B2E4F' }}>Estimated cost</Typography>
                        <TextField
                            fullWidth type="number" placeholder="Enter estimated cost" name='cost' value={customer.cost} onChange={onValueChange}
                            error={!!costError}
                            helperText={costError}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><CurrencyRupeeIcon sx={{ color: '#888780' }} /></InputAdornment>,
                                inputProps: { min: 0, step: 'any' },
                            }}
                            sx={{ mb: 2.5 }}
                        />

                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold', color: '#0B2E4F' }}>Note</Typography>
                        <TextField
                            fullWidth placeholder="Additional notes (optional)" name='note' onChange={onValueChange}
                            InputProps={{ startAdornment: <InputAdornment position="start"><DescriptionIcon sx={{ color: '#888780' }} /></InputAdornment> }}
                            sx={{ mb: 3 }}
                        />

                        <Button
                            fullWidth variant="contained" startIcon={<AddCircleIcon />}
                            sx={{ backgroundColor: '#185FA5', py: 1.25, fontWeight: 'bold', borderRadius: 2 }}
                            onClick={addCustomerDetails}
                        >
                            Add customer
                        </Button>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3.5, borderRadius: 3 }}>
                        <SectionHeader icon={<ShoppingCartIcon />} color="#16A34A" label="NEW ORDER" />

                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold', color: '#0B2E4F' }}>Name</Typography>
                        <TextField
                            fullWidth placeholder="Enter customer name" name='name' onChange={onValueChange}
                            InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#888780' }} /></InputAdornment> }}
                            sx={{ mb: 2.5 }}
                        />

                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold', color: '#0B2E4F' }}>Mobile no.</Typography>
                        <TextField
                            fullWidth placeholder="Enter mobile number" name='mobile' onChange={onValueChange}
                            InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: '#888780' }} /></InputAdornment> }}
                            sx={{ mb: 2.5 }}
                        />

                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold', color: '#0B2E4F' }}>Product details</Typography>
                        <TextField
                            fullWidth placeholder="Enter product details" name='productDetails' onChange={onValueChange}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Inventory2Icon sx={{ color: '#888780' }} /></InputAdornment> }}
                            sx={{ mb: 2.5 }}
                        />

                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold', color: '#0B2E4F' }}>Total amount</Typography>
                        <TextField
                            fullWidth type="number" placeholder="Enter total amount" name='totalAmount' value={order.totalAmount} onChange={onValueChange}
                            error={!!amountError}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><CurrencyRupeeIcon sx={{ color: '#888780' }} /></InputAdornment>,
                                inputProps: { min: 0, step: 'any' },
                            }}
                            sx={{ mb: 2.5 }}
                        />

                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold', color: '#0B2E4F' }}>Advance amount</Typography>
                        <TextField
                            fullWidth type="number" placeholder="Enter advance amount" name='advanceAmount' value={order.advanceAmount} onChange={onValueChange}
                            error={!!amountError}
                            helperText={amountError}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><CurrencyRupeeIcon sx={{ color: '#888780' }} /></InputAdornment>,
                                inputProps: { min: 0, step: 'any' },
                            }}
                            sx={{ mb: 2.5 }}
                        />

                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold', color: '#0B2E4F' }}>Note</Typography>
                        <TextField
                            fullWidth placeholder="Additional notes (optional)" name='note' onChange={onValueChange}
                            InputProps={{ startAdornment: <InputAdornment position="start"><DescriptionIcon sx={{ color: '#888780' }} /></InputAdornment> }}
                            sx={{ mb: 3 }}
                        />

                        <Button
                            fullWidth variant="contained" startIcon={<AddCircleIcon />}
                            sx={{ backgroundColor: '#16A34A', py: 1.25, fontWeight: 'bold', borderRadius: 2 }}
                            onClick={addOrderDetails}
                        >
                            Add order
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}

export default AddCustomer;
