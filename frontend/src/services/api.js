import axios from 'axios';

// const IP = '192.168.1.200';   
// const URL = `http://${IP}:8000`;

const URL = 'http://localhost:8000';

export const addCustomer = async (data) => {
    try {
        return await axios.post(`${URL}/add`, data)

    } catch (error) {
        console.log("error while calling add user API", error);
    }
}

export const getCustomers = async () => {
    try {
        return await axios.get(`${URL}/allCustomer`)
    } catch (error) {
        console.log("error while calling get AllUser API", error);
    }

}

export const getCustomer = async (id) => {
    try {
        return await axios.get(`${URL}/${id}`)
    } catch (error) {
        console.log("error while calling get user API", error);
    }

}

export const editCustomer = async (customer, id) => {
    try {
        return await axios.put(`${URL}/${id}`, customer)
    } catch (error) {
        console.log("error while calling edit API", error);
    }

}

export const deleteCustomer = async (id) => {
    try {
        return await axios.delete(`${URL}/${id}`)
    } catch (error) {
        console.log("error while calling delete API", error);
    }

}

export const changeStatus = async (id, newStatus, timeofdelivery) => {
    try {
        return await axios.put(`${URL}/${id}`, { status: newStatus, time2: timeofdelivery });
    } catch (error) {
        console.log("error while calling get user API", error);
    }
}

export const addOrder = async (data) => {
    try {
        return await axios.post(`${URL}/addOrder`, data)

    } catch (error) {
        console.log("error while calling add order API", error);
    }
}

export const getOrders = async () => {
    try {
        const response = await axios.get(`${URL}/allOrders`);
        return response.data;
    } catch (error) {
        console.log("error calling AllOrder", error);
    }
};

