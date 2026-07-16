import Customer from '../schema/customer-schema.js'


export const addCustomer = async (request, response) => {
    const customer = request.body;
    const newCustomer = new Customer(customer);

    try {
        await newCustomer.save();
        response.status(201).json(newCustomer);
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}

export const getCustomers = async (request, response) => {
    try {
        const constomers = await Customer.find({});
        response.status(200).json(constomers);
    } catch (error) {
        response.status(404).json({ message: error.message })
    }
}

export const getCustomer = async (request, response) => {
    try {
        const constomer = await Customer.findById(request.params.id);
        response.status(200).json(constomer);
    } catch (error) {
        response.status(404).json({ message: error.message })
    }
}

export const editCustomer = async (request, response) => {
    let customer = request.body
    const editc = new Customer(customer)
    try {
        await Customer.updateOne({ _id: request.params.id }, editc);
        response.status(201).json(editc);
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}


export const deleteCustomer = async (request, response) => {
    try {
        await Customer.deleteOne({ _id: request.params.id })
        response.status(201).json({ message: "Deleted successfully" });
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}


export const changeStatus = async (request, response) => {
    try {
        const customer = await Customer.findByIdAndUpdate(request.params.id, { status: newStatus }, { new: true });
        response.status(201).json(customer);
    } catch (error) {
        response.status(404).json({ message: error.message })
    }
}

