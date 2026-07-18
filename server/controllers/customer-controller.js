import Customer from '../schema/customer-schema.js'
import { nextSequence } from '../schema/counter-schema.js'

export const addCustomer = async (request, response) => {
    const customer = request.body;

    try {
        const seq = await nextSequence('customer');
        customer.customerId = `KD${String(seq).padStart(3, '0')}`;
        const newCustomer = new Customer(customer);
        await newCustomer.save();
        response.status(201).json(newCustomer);
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}

export const getCustomers = async (request, response) => {
    try {
        const customers = await Customer.find({});
        response.status(200).json(customers);
    } catch (error) {
        response.status(404).json({ message: error.message })
    }
}

export const getCustomer = async (request, response) => {
    try {
        const customer = await Customer.findById(request.params.id);
        response.status(200).json(customer);
    } catch (error) {
        response.status(404).json({ message: error.message })
    }
}

export const editCustomer = async (request, response) => {
    const customer = request.body;
    try {
        const updated = await Customer.findByIdAndUpdate(request.params.id, customer, { new: true });
        response.status(200).json(updated);
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}

export const deleteCustomer = async (request, response) => {
    try {
        await Customer.deleteOne({ _id: request.params.id })
        response.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}

export const changeStatus = async (request, response) => {
    try {
        const customer = await Customer.findByIdAndUpdate(
            request.params.id,
            { status: request.body.status, time2: request.body.time2 },
            { new: true }
        );
        response.status(200).json(customer);
    } catch (error) {
        response.status(404).json({ message: error.message })
    }
}

export const markDelivered = async (request, response) => {
    try {
        const customer = await Customer.findByIdAndUpdate(
            request.params.id,
            { delivered: true, time2: request.body.time2 },
            { new: true }
        );
        response.status(200).json(customer);
    } catch (error) {
        response.status(404).json({ message: error.message })
    }
}
