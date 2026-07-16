import mongoose from "mongoose";
import autoIncrement from 'mongoose-auto-increment'

autoIncrement.initialize(mongoose.connection);

const customerSchema = mongoose.Schema({
    device: String,
    brand: String,
    name: String,
    mobile: String,
    problem: String,
    cost: String,
    note: String,
    date: String,
    time: String,
    status: String,
    time2: String,
    productDetails: String,
    totalAmount: String,
    advanceAmount: String,
});

// Update plugin usage to use promises
customerSchema.plugin(autoIncrement.plugin, { model: 'customer', field: '_id', startAt: 1 });

const customer = mongoose.model('customer', customerSchema);

export default customer;
