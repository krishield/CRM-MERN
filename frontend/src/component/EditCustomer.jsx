
import { FormControl, FormGroup, InputLabel, Input, Typography, styled, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { editCustomer, getCustomer } from "../services/api.js";
import { useNavigate, useParams } from "react-router-dom";


const Container = styled(FormGroup)`
    width: 50%;
    margin: 5% auto 0 auto;
    & > div{
        margin-top:20px
    }
`;

const Title = styled(Typography)`
  font-weight: bold;
  font-size: 1.5rem;
  color: #333; /* change color to your preference */
  text-transform: uppercase; /* optional */
  letter-spacing: 2px; /* optional */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3); /* optional */
`;

const defaultValue = {
    device: '',
    name: '',
    mobile: '',
    problem: '',
    cost: '',
    note: '',
    brand: ''
}

const EditCustomer = () => {

    const [customer, setCustomer] = useState(defaultValue);
    const [costError, setCostError] = useState('');

    const nevigate = useNavigate();

    const { id } = useParams();

    useEffect(() => {
        loadCustomerDetails();
    }, [])

    const loadCustomerDetails = async () => {
        const response = await getCustomer(id)
        setCustomer(response.data)
    }

    const onValueChange = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value })
    }

    const editCustomerDetails = async () => {
        const cost = customer.cost;
        if (cost !== '' && cost !== undefined && cost !== null && (isNaN(cost) || Number(cost) < 0)) {
            setCostError('Cost must be a number');
            return;
        }
        setCostError('');
        const payload = { ...customer, cost: cost === '' || cost === undefined || cost === null ? undefined : Number(cost) };
        await editCustomer(payload, id);
        nevigate('/dashboard');
    }

    return (
        <Container>
            <Title variant="h4">Edit Customer</Title>
            <FormControl>
                <InputLabel>Device</InputLabel>
                <Input onChange={(e) => onValueChange(e)} name='device' value={customer.device} />
            </FormControl>
            <FormControl><InputLabel>Brand/Model</InputLabel>
                <Input onChange={(e) => onValueChange(e)} name='brand' value={customer.brand} />
            </FormControl>
            <FormControl><InputLabel>Name</InputLabel>
                <Input onChange={(e) => onValueChange(e)} name='name' value={customer.name} />
            </FormControl>
            <FormControl><InputLabel>Mobile NO.</InputLabel>
                <Input onChange={(e) => onValueChange(e)} name='mobile' value={customer.mobile} />
            </FormControl>
            <FormControl><InputLabel>Problem</InputLabel>
                <Input onChange={(e) => onValueChange(e)} name='problem' value={customer.problem} />
            </FormControl>
            <FormControl error={!!costError}>
                <InputLabel>Estimated Cost</InputLabel>
                <Input type="number" inputProps={{ min: 0, step: 'any' }} onChange={(e) => onValueChange(e)} name='cost' value={customer.cost} />
                {costError && <Typography variant="caption" sx={{ color: '#DC2626', mt: 0.5 }}>{costError}</Typography>}
            </FormControl>
            <FormControl><InputLabel>Note</InputLabel>
                <Input onChange={(e) => onValueChange(e)} name='note' value={customer.note} />
            </FormControl>
            <FormControl>
                <Button variant="contained" onClick={() => editCustomerDetails()}>Done</Button>
            </FormControl>
        </Container>
    )
}

export default EditCustomer;