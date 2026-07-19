import bcrypt from "bcryptjs";
import Settings from '../schema/settings-schema.js'

const getOrCreateSettings = async () => {
    let settings = await Settings.findOne({});
    if (!settings) {
        settings = new Settings({});
    }
    if (!settings.adminPasswordHash && process.env.ADMIN_PASS_HASH) {
        settings.adminPasswordHash = process.env.ADMIN_PASS_HASH;
    }
    if (settings.isNew || settings.isModified()) {
        await settings.save();
    }
    return settings;
}

export const getSettings = async (request, response) => {
    try {
        const settings = await getOrCreateSettings();
        const { adminPasswordHash, ...safeSettings } = settings.toObject();
        response.status(200).json(safeSettings);
    } catch (error) {
        response.status(404).json({ message: error.message })
    }
}

export const updateSettings = async (request, response) => {
    try {
        const { crmName, logo, idPrefix, deviceTypes } = request.body;
        const settings = await getOrCreateSettings();
        if (crmName !== undefined) settings.crmName = crmName;
        if (logo !== undefined) settings.logo = logo;
        if (idPrefix !== undefined) settings.idPrefix = idPrefix;
        if (deviceTypes !== undefined) settings.deviceTypes = deviceTypes;
        await settings.save();
        const { adminPasswordHash, ...safeSettings } = settings.toObject();
        response.status(200).json(safeSettings);
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}

export const changePassword = async (request, response) => {
    try {
        const { currentPassword, newPassword } = request.body;
        if (!newPassword || newPassword.length < 4) {
            return response.status(409).json({ message: 'New password must be at least 4 characters' });
        }
        const settings = await getOrCreateSettings();
        const validCurrent = await bcrypt.compare(currentPassword || '', settings.adminPasswordHash);
        if (!validCurrent) {
            return response.status(403).json({ message: 'Current password is incorrect' });
        }
        settings.adminPasswordHash = bcrypt.hashSync(newPassword, 10);
        await settings.save();
        response.status(200).json({ message: 'Password updated' });
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}
