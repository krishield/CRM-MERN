import { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Typography, Tabs, Tab, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { getCustomers } from '../services/api.js';

const MASK = '••••••';

const parseCost = (cost) => {
    const n = parseFloat(String(cost).replace(/[^0-9.]/g, ''));
    return isNaN(n) ? 0 : n;
}

const rupee = (n) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const StatCard = ({ label, value, color }) => (
    <Paper sx={{ p: 2.5, borderRadius: 3, flex: '1 1 200px' }}>
        <Typography variant="body2" sx={{ color: '#888780', mb: 0.5 }}>{label}</Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: color || '#0B2E4F' }}>{value}</Typography>
    </Paper>
);

const Revenue = () => {
    const [customers, setCustomers] = useState([]);
    const [view, setView] = useState('monthly');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const load = async () => {
            const response = await getCustomers();
            setCustomers(response.data);
        }
        load();
    }, []);

    const revenueRecords = useMemo(() => {
        return customers
            .filter(c => c.status === 'repaired' && c.delivered)
            .map(c => ({ ...c, amount: parseCost(c.cost), date: new Date(c.updatedAt) }));
    }, [customers]);

    const now = new Date();
    const currentQuarter = Math.floor(now.getMonth() / 3);

    const totals = useMemo(() => {
        let month = 0, quarter = 0, year = 0, allTime = 0;
        revenueRecords.forEach(r => {
            allTime += r.amount;
            if (r.date.getFullYear() === now.getFullYear()) {
                year += r.amount;
                if (Math.floor(r.date.getMonth() / 3) === currentQuarter) quarter += r.amount;
                if (r.date.getMonth() === now.getMonth()) month += r.amount;
            }
        });
        return { month, quarter, year, allTime };
    }, [revenueRecords]);

    const breakdown = useMemo(() => {
        const buckets = {};
        revenueRecords.forEach(r => {
            let key, label;
            const y = r.date.getFullYear();
            if (view === 'monthly') {
                key = `${y}-${r.date.getMonth()}`;
                label = `${monthNames[r.date.getMonth()]} ${y}`;
            } else if (view === 'quarterly') {
                const q = Math.floor(r.date.getMonth() / 3) + 1;
                key = `${y}-Q${q}`;
                label = `Q${q} ${y}`;
            } else {
                key = `${y}`;
                label = `${y}`;
            }
            if (!buckets[key]) buckets[key] = { label, count: 0, amount: 0, sortKey: key };
            buckets[key].count += 1;
            buckets[key].amount += r.amount;
        });
        return Object.values(buckets).sort((a, b) => b.sortKey.localeCompare(a.sortKey));
    }, [revenueRecords, view]);

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    onClick={() => setVisible(!visible)}
                    sx={{ borderColor: '#0B2E4F', color: '#0B2E4F' }}
                >
                    {visible ? 'Hide values' : 'Show values'}
                </Button>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <StatCard label="This month" value={visible ? rupee(totals.month) : MASK} color="#0E9594" />
                <StatCard label="This quarter" value={visible ? rupee(totals.quarter) : MASK} color="#0B2E4F" />
                <StatCard label="This year" value={visible ? rupee(totals.year) : MASK} color="#16A34A" />
                <StatCard label="All time" value={visible ? rupee(totals.allTime) : MASK} color="#185FA5" />
            </Box>

            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Tabs value={view} onChange={(e, v) => setView(v)} sx={{ px: 2, borderBottom: '1px solid #E5E7EB' }}>
                    <Tab value="monthly" label="Monthly" />
                    <Tab value="quarterly" label="Quarterly" />
                    <Tab value="yearly" label="Yearly" />
                </Tabs>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#0B2E4F' }}>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Period</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Repairs delivered</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Revenue</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {breakdown.map(b => (
                            <TableRow key={b.sortKey} sx={{ '&:hover': { backgroundColor: '#F4F6F9' } }}>
                                <TableCell>{b.label}</TableCell>
                                <TableCell>{b.count}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#16A34A' }}>{visible ? rupee(b.amount) : MASK}</TableCell>
                            </TableRow>
                        ))}
                        {breakdown.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} sx={{ textAlign: 'center', color: '#888780', py: 4 }}>
                                    No delivered repairs yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
};

export default Revenue;
