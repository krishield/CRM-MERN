
import { FormControl, FormGroup, InputLabel, Input, Typography, styled, Button, Select, MenuItem, Grid, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { addCustomer, addOrder } from "../services/api.js";
import { useNavigate } from "react-router-dom";

const Container = styled(FormGroup)`
    width: 90%;
    max-width: 1100px;
    margin: 2% auto 0 auto;
    padding: 32px;
    background-color: #FFFFFF;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(11, 46, 79, 0.12);

    & > div {
        margin-top: 20px;
    }
`;

const Title = styled(Typography)`
font-size: 26px;
font-weight: bold;
margin-bottom: 16px;
color: #0B2E4F;
text-transform: uppercase;
letter-spacing: 1px;
border-bottom: 3px solid #0E9594;
padding-bottom: 8px;
`;


const defaultValue = {
    device: '--',
    brand: '--',
    name: '--',
    mobile: '--',
    problem: '--',
    cost: '--',
    note: '--',
    date: "--",
    time: "--",
    status: 'pending',
    time2: '',
    productDetails: '--',
    totalAmount: '--',
    advanceAmount: '--',

}


const AddCustomer = () => {

    const [customer, setCustomer] = useState(defaultValue);
    const [order, setOrder] = useState(defaultValue);
    const nevigate = useNavigate();

    const onValueChange = (e) => {
        console.log(e.target.name, e.target.value)
        setCustomer({ ...customer, [e.target.name]: e.target.value })
        setOrder({ ...order, [e.target.name]: e.target.value })
    }

    const addCustomerDetails = async () => {
        const currentTime = new Date().toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour12: true,
            hour: 'numeric',
            minute: 'numeric'
        });
        const currentDate = new Date().toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        customer.time = currentTime;
        customer.date = currentDate;
        console.log(customer);
        await addCustomer(customer);
        nevigate('/pending')
    }

    const addOrderDetails = async () => {
        const currentTime = new Date().toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata', hour12: true, hour: 'numeric', minute: 'numeric'
        });
        const currentDate = new Date().toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', year: 'numeric'
        });
        order.time = currentTime;
        order.date = currentDate;
        await addOrder(order);
        nevigate('/orders')
    }

    return (

        <Container>
            <Grid container spacing={4}>
                <Grid item xs={10} md={6}>
                    <Title variant="h4" style={{ width: '80%' }}>New Customer</Title>
                    <FormControl fullWidth style={{ width: '80%' }}>
                        <Select defaultValue='device' onChange={(e) => onValueChange(e)} name='device'>
                            <MenuItem value='device' disabled>Select Type</MenuItem>
                            <MenuItem value='Laptop'>Laptop</MenuItem>
                            <MenuItem value='Desktop'>Desktop</MenuItem>
                            <MenuItem value='Mobile'>Mobile</MenuItem>
                            <MenuItem value='Tablet'>Tablet</MenuItem>
                            <MenuItem value='Printer'>Printer</MenuItem>
                        </Select>
                    </FormControl>
                    <Box mt={2}>
                        <FormControl fullWidth style={{ width: '80%' }}>
                            <InputLabel>Brand/Model</InputLabel>
                            <Input onChange={(e) => onValueChange(e)} name='brand' />
                        </FormControl>
                    </Box>
                    <Box mt={2}>
                        <FormControl fullWidth style={{ width: '80%' }}>
                            <InputLabel>Customer Name</InputLabel>
                            <Input onChange={(e) => onValueChange(e)} name='name' />
                        </FormControl>
                    </Box>
                    <Box mt={2}>
                        <FormControl fullWidth style={{ width: '80%' }}>
                            <InputLabel>Mobile No.</InputLabel>
                            <Input onChange={(e) => onValueChange(e)} name='mobile' />
                        </FormControl>
                    </Box>
                    <Box mt={2}>
                        <FormControl fullWidth style={{ width: '80%' }}>
                            <InputLabel>Problem</InputLabel>
                            <Input onChange={(e) => onValueChange(e)} name='problem' />
                        </FormControl>
                    </Box>
                    <Box mt={2}>
                        <FormControl fullWidth style={{ width: '80%' }}>
                            <InputLabel>Estimated Cost</InputLabel>
                            <Input onChange={(e) => onValueChange(e)} name='cost' />
                        </FormControl>
                    </Box>
                    <Box mt={2}>
                        <FormControl fullWidth style={{ width: '80%' }}>
                            <InputLabel>Note</InputLabel>
                            <Input onChange={(e) => onValueChange(e)} name='note' />
                        </FormControl>
                    </Box>
                    <Box mt={2}>
                        <FormControl fullWidth style={{ width: '80%' }}>
                            <Button variant="contained" style={{ width: '100px', borderRadius: '10px', fontWeight: 'bold', fontSize: 20, marginTop: 10 }} onClick={() => addCustomerDetails()}>ADD</Button>
                        </FormControl>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box mt={4}>
                        <Title variant="h4" style={{ width: '80%' }}>New Order</Title>
                        <FormControl fullWidth style={{ width: '80%' }}>
                            <InputLabel>Name</InputLabel>
                            <Input onChange={(e) => onValueChange(e)} name='name' />
                        </FormControl>

                        <Box mt={2}>
                            <FormControl fullWidth style={{ width: '80%' }}>
                                <InputLabel>Mobile No.</InputLabel>
                                <Input onChange={(e) => onValueChange(e)} name='mobile' />
                            </FormControl>
                        </Box>

                        <Box mt={2}>
                            <FormControl fullWidth style={{ width: '80%' }}>
                                <InputLabel>Product Details</InputLabel>
                                <Input onChange={(e) => onValueChange(e)} name='productDetails' />
                            </FormControl>
                        </Box>

                        <Box mt={2}>
                            <FormControl fullWidth style={{ width: '80%' }}>
                                <InputLabel>Total Amount</InputLabel>
                                <Input onChange={(e) => onValueChange(e)} name='totalAmount' />
                            </FormControl>
                        </Box>

                        <Box mt={5}>
                            <FormControl fullWidth style={{ width: '80%' }}>
                                <InputLabel>Advance Amount</InputLabel>
                                <Input onChange={(e) => onValueChange(e)} name='advanceAmount' />
                            </FormControl>
                        </Box>
                        <Box mt={5}>
                            <FormControl fullWidth style={{ width: '80%' }}>
                                <InputLabel>Note</InputLabel>
                                <Input onChange={(e) => onValueChange(e)} name='note' />
                            </FormControl>
                        </Box>
                        <Box mt={5}>
                            <FormControl fullWidth style={{ width: '80%' }}>
                                <Button variant="contained" style={{ width: '100px', borderRadius: '10px', fontWeight: 'bold', fontSize: 20, marginTop: 20 }} onClick={() => addOrderDetails()}>ADD</Button>
                            </FormControl>

                        </Box>

                    </Box>
                </Grid>
            </Grid>
        </Container >

    )
}

export default AddCustomer;