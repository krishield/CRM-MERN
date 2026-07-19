import apiClient from './apiClient.js';

export const login = async (username, password) => {
    return await apiClient.post('/login', { username, password });
}

export const addCustomer = async (data) => {
    try {
        return await apiClient.post('/add', data)
    } catch (error) {
        console.log("error while calling add user API", error);
    }
}

export const getCustomers = async () => {
    try {
        return await apiClient.get('/allCustomer')
    } catch (error) {
        console.log("error while calling get AllUser API", error);
    }
}

export const getCustomer = async (id) => {
    try {
        return await apiClient.get(`/${id}`)
    } catch (error) {
        console.log("error while calling get user API", error);
    }
}

export const editCustomer = async (customer, id) => {
    try {
        return await apiClient.put(`/${id}`, customer)
    } catch (error) {
        console.log("error while calling edit API", error);
    }
}

export const deleteCustomer = async (id) => {
    try {
        return await apiClient.delete(`/${id}`)
    } catch (error) {
        console.log("error while calling delete API", error);
    }
}

export const changeStatus = async (id, newStatus, timeofdelivery) => {
    try {
        return await apiClient.patch(`/${id}/status`, { status: newStatus, time2: timeofdelivery });
    } catch (error) {
        console.log("error while calling change status API", error);
    }
}

export const markDelivered = async (id, timeofdelivery) => {
    try {
        return await apiClient.patch(`/${id}/deliver`, { time2: timeofdelivery });
    } catch (error) {
        console.log("error while calling mark delivered API", error);
    }
}

export const addOrder = async (data) => {
    try {
        return await apiClient.post('/addOrder', data)
    } catch (error) {
        console.log("error while calling add order API", error);
    }
}

export const getOrders = async () => {
    try {
        return await apiClient.get('/allOrders');
    } catch (error) {
        console.log("error while calling get orders API", error);
    }
}

export const changeOrderStatus = async (id, newStatus) => {
    try {
        return await apiClient.patch(`/order/${id}/status`, { status: newStatus });
    } catch (error) {
        console.log("error while calling change order status API", error);
    }
}

export const deleteOrder = async (id) => {
    try {
        return await apiClient.delete(`/order/${id}`)
    } catch (error) {
        console.log("error while calling delete order API", error);
    }
}

export const getSettings = async () => {
    try {
        return await apiClient.get('/settings');
    } catch (error) {
        console.log("error while calling get settings API", error);
    }
}

export const updateSettings = async (data) => {
    try {
        return await apiClient.put('/settings', data);
    } catch (error) {
        console.log("error while calling update settings API", error);
    }
}
