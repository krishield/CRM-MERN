import Settings from '../schema/settings-schema.js'

export const getSettings = async (request, response) => {
    try {
        let settings = await Settings.findOne({});
        if (!settings) {
            settings = await new Settings({}).save();
        }
        response.status(200).json(settings);
    } catch (error) {
        response.status(404).json({ message: error.message })
    }
}

export const updateSettings = async (request, response) => {
    try {
        const { crmName, logo } = request.body;
        let settings = await Settings.findOne({});
        if (!settings) {
            settings = new Settings({});
        }
        if (crmName !== undefined) settings.crmName = crmName;
        if (logo !== undefined) settings.logo = logo;
        await settings.save();
        response.status(200).json(settings);
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}
