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

const stripSecrets = (settings) => {
    const { adminPasswordHash, ownerPinHash, ...safeSettings } = settings.toObject();
    return { ...safeSettings, ownerPinSet: !!ownerPinHash };
}

export const getSettings = async (request, response) => {
    try {
        const settings = await getOrCreateSettings();
        response.status(200).json(stripSecrets(settings));
    } catch (error) {
        response.status(404).json({ message: error.message })
    }
}

export const updateSettings = async (request, response) => {
    try {
        const { crmName, logo, idPrefix, orderIdPrefix, deviceTypes, ordersEnabled } = request.body;
        const settings = await getOrCreateSettings();
        if (crmName !== undefined) settings.crmName = crmName;
        if (logo !== undefined) settings.logo = logo;
        if (idPrefix !== undefined) settings.idPrefix = idPrefix;
        if (orderIdPrefix !== undefined) settings.orderIdPrefix = orderIdPrefix;
        if (deviceTypes !== undefined) settings.deviceTypes = deviceTypes;
        if (ordersEnabled !== undefined) settings.ordersEnabled = ordersEnabled;
        await settings.save();
        response.status(200).json(stripSecrets(settings));
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

export const setOwnerPin = async (request, response) => {
    try {
        const { currentPin, newPin } = request.body;
        if (!newPin || !/^\d{4,}$/.test(newPin)) {
            return response.status(409).json({ message: 'PIN must be at least 4 digits' });
        }
        const settings = await getOrCreateSettings();
        if (settings.ownerPinHash) {
            const validCurrent = await bcrypt.compare(currentPin || '', settings.ownerPinHash);
            if (!validCurrent) {
                return response.status(403).json({ message: 'Current PIN is incorrect' });
            }
        }
        settings.ownerPinHash = bcrypt.hashSync(newPin, 10);
        await settings.save();
        response.status(200).json({ message: 'PIN updated' });
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}

export const verifyOwnerPin = async (request, response) => {
    try {
        const { pin } = request.body;
        const settings = await getOrCreateSettings();
        if (!settings.ownerPinHash) {
            return response.status(409).json({ message: 'No owner PIN has been set yet' });
        }
        const valid = await bcrypt.compare(pin || '', settings.ownerPinHash);
        if (!valid) {
            return response.status(403).json({ message: 'Incorrect PIN' });
        }
        response.status(200).json({ valid: true });
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}
