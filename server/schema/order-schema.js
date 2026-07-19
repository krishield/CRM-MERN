import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    name: String,
    mobile: String,
    productDetails: String,
    totalAmount: { type: Number, min: 0 },
    advanceAmount: { type: Number, min: 0 },
    note: String,
    date: String,
    time: String,
    status: {
        type: String,
        enum: ['pending', 'complete'],
        default: 'pending',
    },
}, { timestamps: true });

const Order = mongoose.model('order', orderSchema);

export default Order;
