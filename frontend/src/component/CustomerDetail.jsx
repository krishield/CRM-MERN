
import { useEffect, useState } from "react";
import { getCustomer } from "../services/api.js";
import { useNavigate, useParams } from "react-router-dom";
import Chip from '@material-ui/core/Chip';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 20px;
  width: 80%;
  max-width: 600px;

  @media only screen and (max-width: 768px) {
    padding: 20px;
  }
`;

const Title = styled.h2`
font-size: 32px;
font-weight: bold;
margin-bottom: 16px;
color: #333;
text-transform: uppercase;
letter-spacing: 2px;
font-family: 'Merriweather', serif;
border-bottom: 2px solid #6c5ce7;
padding-bottom: 8px;
`;

const Detail = styled.p`
  font-size: 20px;
  margin-bottom: 5px;
  color: #ggg;
  span {
    font-weight: bold;
    color: #111;
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
          backgroundColor: customer.status === 'repaired' ? 'green' :
            customer.status === 'not-repaired' ? 'red' :
              customer.status === 'pending' ? 'orange' :
                customer.status === 'checked' ? 'blue' :
                  customer.status === 'completed' ? 'purple' : 'black',
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
