import { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material'
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import SearchBar from 'material-ui-search-bar';
import DeleteIcon from '@mui/icons-material/Delete';
import { getCustomers, deleteCustomer } from '../services/api.js';
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
        let response = await getCustomers();
        const allorders = response.data.filter(e => e.status === 'Pending-Order' || e.status === 'Complete-Order');
        setOrder(allorders);
        setOriginalCustomers(allorders);
    }

    const deleteCustomerDetails = async (id) => {
        await deleteCustomer(id);
        getAllCustomers();
    }

    const requestSearch = (searchedVal) => {
        const filteredCustomers = originalCustomers.filter((order) => {
            return order.name.toLowerCase().includes(searchedVal.toLowerCase());
        });
        setOrder(filteredCustomers);
    };

    const cancelSearch = () => {
        setOrder(originalCustomers);
        setSearched("");
    };

    return (
        <Loading isLoading={isLoading}>
            {isLoading ? <div>Loading...</div> : (
                <div>
                    <Paper>
                        <SearchBar
                            value={searched}
                            onChange={(searchval) => requestSearch(searchval)}
                            onCancelSearch={() => cancelSearch()}
                            style={{
                                height: '50px',
                                fontSize: '17px',
                                width: '50%',
                                margin: '50px auto 0 auto',
                                backgroundColor: '#9ff5ec', // set the background color here
                                color: 'black' // set the text color here
                            }}
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
                                                        backgroundColor: order.status === 'Pending-Order' ? 'Orange' :
                                                            order.status === 'Complete-Order' ? 'green' : 'black',

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