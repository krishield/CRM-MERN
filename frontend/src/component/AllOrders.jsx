import { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Chip, Paper, TextField, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { getOrders, deleteOrder } from '../services/api.js';
import { Link } from "react-router-dom";
import styled from 'styled-components';


const StyleTable = styled(Table)`
    width:90%;
    margin: 50px auto 0 auto;
   
`;

const TableHead1 = styled(TableHead)`
  background-color: #f7f7f7;
`;

const THead = styled(TableRow)`
    & > th:first-child {
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
    }

  & > th:last-child {
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
    }
    & > th {
        font-size: 20px;
        background-color: #054F81;
        color: #fff;
        text-align: center;
        padding: 16px;
        text-transform: uppercase;
        letter-spacing: 1px;
        border-bottom: 2px solid #fff;
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
        font-weight: bold;
        

    }
`;

const TBody = styled(TableRow)`
    & > td{
        font-size: 18px;
        text-align: center;
    }
`;

const Loading = styled.div`
  opacity: ${props => props.isLoading ? 0 : 2};
  transition: opacity 0.3s ease-in-out;
`;

const AllOrders = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 20);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    const [orders, setOrder] = useState([]);
    const [searched, setSearched] = useState('');
    const [originalCustomers, setOriginalCustomers] = useState([]);


    useEffect(() => {
        getAllCustomers();
    }, []);

    const getAllCustomers = async () => {
        let response = await getOrders();
        setOrder(response.data);
        setOriginalCustomers(response.data);
    }

    const deleteCustomerDetails = async (id) => {
        await deleteOrder(id);
        getAllCustomers();
    }

    const requestSearch = (searchedVal) => {
        setSearched(searchedVal);
        const filteredCustomers = originalCustomers.filter((order) => {
            return order.name.toLowerCase().includes(searchedVal.toLowerCase());
        });
        setOrder(filteredCustomers);
    };

    return (
        <Loading isLoading={isLoading}>
            {isLoading ? <div>Loading...</div> : (
                <div>
                    <Paper>
                        <TextField
                            value={searched}
                            onChange={(e) => requestSearch(e.target.value)}
                            placeholder="Search"
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ width: '50%', margin: '50px auto 0 auto', display: 'block' }}
                        />
                        <StyleTable>

                            <TableHead1 >
                                <THead>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Contact</TableCell>
                                    <TableCell>Product Details</TableCell>
                                    <TableCell>Total Amount</TableCell>
                                    <TableCell>Advance Amount</TableCell>
                                    <TableCell>Note</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </THead>
                            </TableHead1>
                            <TableBody>
                                {
                                    orders.map(order => (
                                        <TBody key={order._id}>
                                            <TableCell>{order._id}</TableCell>
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
                                                    style={{
                                                        fontWeight: 'bold',
                                                        backgroundColor: order.status === 'pending' ? 'Orange' :
                                                            order.status === 'complete' ? 'green' : 'black',

                                                        borderRadius: 10,
                                                        padding: '1px 5px',
                                                        textTransform: 'uppercase'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button><DeleteIcon color='error' onClick={() => deleteCustomerDetails(order._id)} /></Button>

                                            </TableCell>

                                        </TBody>
                                    ))
                                }

                            </TableBody>
                        </StyleTable>
                    </Paper>
                </div>
            )}
        </Loading>
    );


}

export default AllOrders;