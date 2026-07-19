import mongoose from "mongoose";

const settingsSchema = mongoose.Schema({
    crmName: { type: String, default: 'KD CRM' },
    logo: { type: String, default: '' },
});

const Settings = mongoose.model('settings', settingsSchema);

export default Settings;
