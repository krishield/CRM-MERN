import mongoose from "mongoose";

const customerSchema = mongoose.Schema({
    customerId: { type: String, unique: true },
    device: String,
    brand: String,
    name: String,
    mobile: String,
    problem: String,
    cost: String,
    note: String,
    date: String,
    time: String,
    status: {
        type: String,
        enum: ['pending', 'checked', 'completed', 'repaired', 'not-repaired'],
        default: 'pending',
    },
    time2: String,
    delivered: { type: Boolean, default: false },
}, { timestamps: true });

const Customer = mongoose.model('customer', customerSchema);

export default Customer;
