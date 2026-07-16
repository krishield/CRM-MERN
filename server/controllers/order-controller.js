import Order from '../schema/customer-schema.js'


export const addOrder = async (request, response) => {
    const order = request.body;
    const newOrder = new Order(order);

    try {
        await newOrder.save();
        response.status(201).json(newOrder);
    } catch (error) {
        response.status(409).json({ message: error.message })
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

