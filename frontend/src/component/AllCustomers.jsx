import { useEffect, useMemo, useState } from 'react';
import {
    Table, TableHead, TableRow, TableCell, TableBody, Button, Chip, Paper,
    TextField, InputAdornment, Select, MenuItem, Box,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { getCustomers, deleteCustomer } from '../services/api.js';
import { Link } from "react-router-dom";
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

const statusColor = {
    repaired: '#16A34A',
    'not-repaired': '#DC2626',
    pending: '#D97706',
    checked: '#0E9594',
    completed: '#0B2E4F',
};

const statusOptions = ['all', 'pending', 'checked', 'completed', 'repaired', 'not-repaired'];

const AllCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [searched, setSearched] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [pendingDelete, setPendingDelete] = useState(null);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        const response = await getCustomers();
        setCustomers(response.data);
    }

    const confirmDelete = async () => {
        await deleteCustomer(pendingDelete._id);
        setPendingDelete(null);
        loadCustomers();
    }

    const filtered = useMemo(() => {
        return customers.filter(c => {
            const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
            const q = searched.toLowerCase();
            const matchesSearch = !q
                || c.name.toLowerCase().includes(q)
                || c.mobile.toLowerCase().includes(q)
                || (c.customerId || '').toLowerCase().includes(q);
            return matchesStatus && matchesSearch;
        });
    }, [customers, searched, statusFilter]);

    return (
        <Box sx={{ p: 4 }}>
            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', gap: 2, p: 2.5, borderBottom: '1px solid #E5E7EB' }}>
                    <TextField
                        value={searched}
                        onChange={(e) => setSearched(e.target.value)}
                        placeholder="Search by name, mobile, or ID"
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
                            <TableCell>Name</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell>Device</TableCell>
                            <TableCell>Problem</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </THead>
                    </TableHead>
                    <TableBody>
                        {filtered.map(customer => (
                            <TBody key={customer._id}>
                                <TableCell>{customer.customerId}</TableCell>
                                <TableCell>{customer.name}</TableCell>
                                <TableCell>{customer.mobile}</TableCell>
                                <TableCell>{customer.device}</TableCell>
                                <TableCell>{customer.problem}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={customer.status}
                                        size="small"
                                        style={{
                                            fontWeight: 'bold',
                                            backgroundColor: statusColor[customer.status] || '#5F5E5A',
                                            color: 'white',
                                            textTransform: 'uppercase'
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button size="small" variant='contained' style={{ marginRight: 8 }} color="info" component={Link} to={`/info/${customer._id}`}>Details</Button>
                                    <Button size="small" variant='contained' style={{ marginRight: 8 }} color="secondary" component={Link} to={`/edit/${customer._id}`}>Edit</Button>
                                    <Button size="small"><DeleteIcon color='error' onClick={() => setPendingDelete(customer)} /></Button>
                                </TableCell>
                            </TBody>
                        ))}
                        {filtered.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} sx={{ textAlign: 'center', color: '#888780', py: 4 }}>
                                    No customers match your search.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={!!pendingDelete} onClose={() => setPendingDelete(null)}>
                <DialogTitle>Delete customer?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This will permanently delete {pendingDelete?.customerId} &middot; {pendingDelete?.name}. This can't be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPendingDelete(null)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={confirmDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default AllCustomers;
