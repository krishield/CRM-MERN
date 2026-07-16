import Order from '../schema/order-schema.js'

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

export const getOrders = async (request, response) => {
    try {
        const orders = await Order.find({});
        response.status(200).json(orders);
    } catch (error) {
        response.status(404).json({ message: error.message })
    }
}

export const changeOrderStatus = async (request, response) => {
    try {
        const order = await Order.findByIdAndUpdate(
            request.params.id,
            { status: request.body.status },
            { new: true }
        );
        response.status(200).json(order);
    } catch (error) {
        response.status(404).json({ message: error.message })
    }
}

export const deleteOrder = async (request, response) => {
    try {
        await Order.deleteOne({ _id: request.params.id })
        response.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}
