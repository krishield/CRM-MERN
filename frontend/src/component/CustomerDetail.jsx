
import { useEffect, useState } from "react";
import { getCustomer } from "../services/api.js";
import { useNavigate, useParams } from "react-router-dom";
import { Chip } from '@mui/material';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 1px 3px rgba(11, 46, 79, 0.12);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 20px auto;
  width: 80%;
  max-width: 600px;

  @media only screen and (max-width: 768px) {
    padding: 20px;
  }
`;

const Title = styled.h2`
font-size: 24px;
font-weight: bold;
margin-bottom: 16px;
color: #0B2E4F;
text-transform: uppercase;
letter-spacing: 1px;
border-bottom: 3px solid #0E9594;
padding-bottom: 8px;
`;

const Detail = styled.p`
  font-size: 18px;
  margin-bottom: 5px;
  color: #5F5E5A;
  span {
    font-weight: bold;
    color: #0B2E4F;
  }
`;


const defaultValue = {
  device: "",
  name: "",
  mobile: "",
  problem: "",
  cost: "",
  note: "",
  brand: "",
};

const CustomerDetails = () => {
  const [customer, setCustomer] = useState(defaultValue);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    loadCustomerDetails();
  }, []);

  const loadCustomerDetails = async () => {
    const response = await getCustomer(id);
    setCustomer(response.data);
  };

  return (
    <Container>
      <Title>Customer Details</Title>
      <Detail><span>Device:</span> &nbsp; {customer.device}</Detail>
      <Detail><span>Brand/Model:</span> {customer.brand}</Detail>
      <Detail><span>Name:</span> {customer.name}</Detail>
      <Detail><span>Mobile No.:</span> {customer.mobile}</Detail>
      <Detail><span>Problem:</span> {customer.problem}</Detail>
      <Detail><span>Estimated Cost:</span> {customer.cost}</Detail>
      <Detail><span>Note:</span> {customer.note}</Detail>
      <Detail><span>Added On:</span> {customer.date} @ {customer.time}</Detail>
      <Detail><span>Delivered On:</span> {customer.time2}</Detail>
      <Detail><span>STATUS:</span><Chip
        label={customer.status}
        style={{
          fontWeight: 'bold',
          backgroundColor: customer.status === 'repaired' ? '#16A34A' :
            customer.status === 'not-repaired' ? '#DC2626' :
              customer.status === 'pending' ? '#D97706' :
                customer.status === 'checked' ? '#0E9594' :
                  customer.status === 'completed' ? '#0B2E4F' : '#5F5E5A',
          color: 'white',
          borderRadius: 20,
          padding: '5px 5px',
          marginLeft: 10,
          textTransform: 'uppercase'
        }}
      /></Detail>

    </Container>

  );
};

export default CustomerDetails;
