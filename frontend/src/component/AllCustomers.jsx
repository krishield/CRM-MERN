import { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Chip, Paper, TextField, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
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
        background-color: #0B2E4F;
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

const Allcustomers = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 20);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    const [customers, setCustomer] = useState([]);
    const [searched, setSearched] = useState('');
    const [originalCustomers, setOriginalCustomers] = useState([]);


    useEffect(() => {
        getAllCustomers();
    }, []);

    const getAllCustomers = async () => {
        let response = await getCustomers();
        const pendingCustomer = response.data.filter(e => e.status === 'repaired' || e.status === 'not-repaired'|| e.status === 'pending'|| e.status === 'checked'|| e.status === 'completed' );
        setCustomer(pendingCustomer);
        setOriginalCustomers(pendingCustomer);
    }

    const deleteCustomerDetails = async (id) => {
        await deleteCustomer(id);
        getAllCustomers();
    }

    const requestSearch = (searchedVal) => {
        setSearched(searchedVal);
        const filteredCustomers = originalCustomers.filter((customer) => {
          const lowerCaseName = customer.name.toLowerCase();
          const lowerCaseMobile = customer.mobile.toLowerCase();
          const lowerCaseSearchVal = searchedVal.toLowerCase();
          return lowerCaseName.includes(lowerCaseSearchVal) || lowerCaseMobile.includes(lowerCaseSearchVal);
        });
        setCustomer(filteredCustomers);
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
                                    <TableCell>Id</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Contact</TableCell>
                                    <TableCell>Device</TableCell>
                                    <TableCell>Problem</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </THead>
                            </TableHead1>
                            <TableBody>
                                {
                                    customers.map(customer => (
                                        <TBody key={customer._id}>
                                            <TableCell>{customer.customerId}</TableCell>
                                            <TableCell>{customer.name}</TableCell>
                                            <TableCell>{customer.mobile}</TableCell>
                                            <TableCell>{customer.device}</TableCell>
                                            <TableCell>{customer.problem}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={customer.status}
                                                    style={{
                                                        fontWeight: 'bold',
                                                        backgroundColor: customer.status === 'repaired' ? '#16A34A' :
                                                            customer.status === 'not-repaired' ? '#DC2626' :
                                                            customer.status === 'pending' ? '#D97706' :
                                                            customer.status === 'checked' ? '#0E9594' :
                                                            customer.status === 'completed' ? '#0B2E4F' : '#5F5E5A',
                                                        color: 'white',
                                                        borderRadius: 10,
                                                        padding: '1px 5px',
                                                        textTransform: 'uppercase'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button variant='contained' style={{ marginRight: 10 }} color="info" component={Link} to={`/info/${customer._id}`}>Details</Button>
                                                <Button variant='contained' style={{ marginRight: 10 }} color="secondary" component={Link} to={`/edit/${customer._id}`}>Edit</Button>
                                                <Button><DeleteIcon color='error' onClick={() => deleteCustomerDetails(customer._id)} /></Button>

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

export default Allcustomers;