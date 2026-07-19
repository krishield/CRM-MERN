import mongoose from "mongoose";

const settingsSchema = mongoose.Schema({
    crmName: { type: String, default: 'KD CRM' },
    logo: { type: String, default: '' },
    idPrefix: { type: String, default: 'KD' },
    orderIdPrefix: { type: String, default: 'OD' },
    deviceTypes: { type: [String], default: ['Laptop', 'Desktop', 'Mobile', 'Tablet', 'Printer'] },
    adminPasswordHash: { type: String, default: '' },
});

const Settings = mongoose.model('settings', settingsSchema);

export default Settings;
