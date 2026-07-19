import { useEffect, useMemo, useState } from 'react';
import {
    Table, TableHead, TableRow, TableCell, TableBody, Button, Chip, Paper,
    TextField, InputAdornment, Select, MenuItem, Box
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { getOrders, deleteOrder } from '../services/api.js';
import styled from 'styled-components';

const THead = styled(TableRow)`
    & > th {
        font-size: 13px;
        background-color: #0B2E4F;
        color: #fff;
        text-align: left;
        padding: 14px 16px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: bold;
    }
`;

const TBody = styled(TableRow)`
    & > td {
        font-size: 14px;
        padding: 12px 16px;
    }
    &:hover {
        background-color: #F4F6F9;
    }
`;

const statusColor = { pending: '#D97706', complete: '#16A34A' };
const statusOptions = ['all', 'pending', 'complete'];

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [searched, setSearched] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        const response = await getOrders();
        setOrders(response.data);
    }

    const deleteOrderDetails = async (id) => {
        await deleteOrder(id);
        loadOrders();
    }

    const filtered = useMemo(() => {
        return orders.filter(o => {
            const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
            const q = searched.toLowerCase();
            const matchesSearch = !q
                || o.name.toLowerCase().includes(q)
                || (o.mobile || '').toLowerCase().includes(q);
            return matchesStatus && matchesSearch;
        });
    }, [orders, searched, statusFilter]);

    return (
        <Box sx={{ p: 4 }}>
            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', gap: 2, p: 2.5, borderBottom: '1px solid #E5E7EB' }}>
                    <TextField
                        value={searched}
                        onChange={(e) => setSearched(e.target.value)}
                        placeholder="Search by name or mobile"
                        variant="outlined"
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#888780' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ flex: 1 }}
                    />
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        size="small"
                        sx={{ minWidth: 180 }}
                    >
                        {statusOptions.map(s => (
                            <MenuItem key={s} value={s}>{s === 'all' ? 'All statuses' : s}</MenuItem>
                        ))}
                    </Select>
                </Box>

                <Table>
                    <TableHead>
                        <THead>
                            <TableCell>Id</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell>Product details</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Advance</TableCell>
                            <TableCell>Note</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </THead>
                    </TableHead>
                    <TableBody>
                        {filtered.map(order => (
                            <TBody key={order._id}>
                                <TableCell>{order.orderId}</TableCell>
                                <TableCell>{order.date + ' @ ' + order.time}</TableCell>
                                <TableCell>{order.name}</TableCell>
                                <TableCell>{order.mobile}</TableCell>
                                <TableCell>{order.productDetails}</TableCell>
                                <TableCell>{order.totalAmount}</TableCell>
                                <TableCell>{order.advanceAmount}</TableCell>
                                <TableCell>{order.note}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={order.status}
                                        size="small"
                                        style={{
                                            fontWeight: 'bold',
                                            backgroundColor: statusColor[order.status] || '#5F5E5A',
                                            color: 'white',
                                            textTransform: 'uppercase'
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button size="small"><DeleteIcon color='error' onClick={() => deleteOrderDetails(order._id)} /></Button>
                                </TableCell>
                            </TBody>
                        ))}
                        {filtered.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={10} sx={{ textAlign: 'center', color: '#888780', py: 4 }}>
                                    No orders match your search.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}

export default AllOrders;
