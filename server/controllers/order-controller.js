import Order from '../schema/order-schema.js'
import { nextSequence } from '../schema/counter-schema.js'
import Settings from '../schema/settings-schema.js'

export const addOrder = async (request, response) => {
    const order = request.body;

    try {
        const seq = await nextSequence('order');
        const settings = await Settings.findOne({});
        const prefix = (settings && settings.orderIdPrefix) || 'OD';
        order.orderId = `${prefix}${String(seq).padStart(3, '0')}`;
        const newOrder = new Order(order);
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
