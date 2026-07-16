import { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material'
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';

import { getCustomers, changeStatus, deleteCustomer } from '../services/api.js'
import styled from 'styled-components';
import './list.css';


const StyleTable = styled(Table)`
    width: 90%;
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
        background-color:#054F81;
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

const Orders = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrder] = useState([]);
    const [showData, setShowData] = useState(false);
    const [buttonName, setButtonName] = useState('LIST OF ITEMS');


    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 20);

        return () => {
            clearTimeout(timer);
        };
    }, []);


    useEffect(() => {
        getAllCustomers();
    }, []);

    const getAllCustomers = async () => {
        let response = await getCustomers();
        const orders = response.data.filter(e => e.status === 'Pending-Order');
        setOrder(orders);

    }



    const markChecked = async (id, newStatus) => {
        try {
            await changeStatus(id, newStatus);
            getAllCustomers();
        } catch (error) {
            console.log('Error while marking customer as checked', error);
        }
    }

    const deleteCustomerDetails = async (id) => {
        await deleteCustomer(id);
        getAllCustomers();
    }



    const showList = () => {
        setShowData(!showData);
        setButtonName(showData ? 'LIST OF ITEMS' : 'HIDE LIST');

    };



    return (
        <Loading isLoading={isLoading}>
            {isLoading ? <div>Loading...</div> : (
                <div>
                    <StyleTable>
                        <TableHead1>
                            <THead>
                                <TableCell>ID</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Contact</TableCell>
                                <TableCell>Product Details</TableCell>
                                <TableCell>Total Amount</TableCell>
                                <TableCell>Advance Amount</TableCell>
                                <TableCell>Note</TableCell>
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
                                            <Tooltip title={<h2 style={{ color: "white" }}>Order Complete</h2>} style={{ fontSize: 30 }} placement="top" >
                                                <Button variant='contained' style={{ marginRight: 10 }} color='success' onClick={() => markChecked(order._id, 'Complete-Order')}>
                                                    Complete
                                                </Button>
                                            </Tooltip>
                                            <Button><DeleteIcon color='error' onClick={() => deleteCustomerDetails(order._id)} /></Button>

                                        </TableCell>
                                    </TBody>
                                ))
                            }

                        </TableBody>
                    </StyleTable>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                variant='contained'
                                style={{ marginTop: 20 }}
                                color='success'
                                onClick={showList}
                            >
                                {buttonName}

                            </Button>
                        </div>
                        {showData && (
                            <ul className="order-list">
                                {orders.map((e, index) => (
                                    <li key={index}>{e.productDetails}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </Loading>
    );


}

export default Orders;