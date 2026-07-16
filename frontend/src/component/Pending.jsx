import { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Tooltip, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { getCustomers, changeStatus } from '../services/api.js';
import styled from 'styled-components';

const StyleTable = styled(Table)`
    width: 90%;
    margin: 50px auto 0 auto;
`;

const THead = styled(TableRow)`
    & > th {
        font-size: 18px;
        background-color: #054F81;
        color: #fff;
        text-align: center;
        font-weight: bold;
        text-transform: uppercase;
    }
`;

const TBody = styled(TableRow)`
    & > td {
        font-size: 16px;
        text-align: center;
    }
`;

const Pending = () => {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        loadPending();
    }, []);

    const loadPending = async () => {
        const response = await getCustomers();
        setCustomers(response.data.filter(c => c.status === 'pending'));
    }

    const markChecked = async (id) => {
        await changeStatus(id, 'checked');
        loadPending();
    }

    return (
        <Paper>
            <StyleTable>
                <TableHead>
                    <THead>
                        <TableCell>Id</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Device</TableCell>
                        <TableCell>Problem</TableCell>
                        <TableCell>Cost</TableCell>
                        <TableCell>Actions</TableCell>
                    </THead>
                </TableHead>
                <TableBody>
                    {customers.map(customer => (
                        <TBody key={customer._id}>
                            <TableCell>{customer._id}</TableCell>
                            <TableCell>{customer.date + ' @ ' + customer.time}</TableCell>
                            <TableCell>{customer.name}</TableCell>
                            <TableCell>{customer.mobile}</TableCell>
                            <TableCell>{customer.device}</TableCell>
                            <TableCell>{customer.problem}</TableCell>
                            <TableCell>{customer.cost}</TableCell>
                            <TableCell>
                                <Tooltip title="Mark as Checked">
                                    <Button variant="contained" color="secondary" sx={{ mr: 1 }} onClick={() => markChecked(customer._id)}>
                                        Check
                                    </Button>
                                </Tooltip>
                                <Button variant="contained" color="info" component={Link} to={`/edit/${customer._id}`}>Edit</Button>
                            </TableCell>
                        </TBody>
                    ))}
                </TableBody>
            </StyleTable>
        </Paper>
    );
}

export default Pending;
