import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Settings from '../schema/settings-schema.js'

export const getSetupStatus = async (request, response) => {
    try {
        const settings = await Settings.findOne({});
        const needsSetup = !(settings && settings.adminUsername && settings.adminPasswordHash);
        response.json({ needsSetup });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Internal server error' });
    }
};

export const setupAdmin = async (request, response) => {
    try {
        const { username, password } = request.body;
        if (!username || !password || password.length < 4) {
            return response.status(409).json({ message: 'Username and a password (4+ characters) are required' });
        }

        let settings = await Settings.findOne({});
        if (!settings) settings = new Settings({});

        if (settings.adminUsername && settings.adminPasswordHash) {
            return response.status(403).json({ message: 'Setup has already been completed' });
        }

        settings.adminUsername = username;
        settings.adminPasswordHash = bcrypt.hashSync(password, 10);
        await settings.save();

        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '8h' });
        response.json({ token });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (request, response) => {
    try {
        const { username, password } = request.body;

        const settings = await Settings.findOne({});
        const validUser = !!settings && username === settings.adminUsername;
        const validPassword = validUser && await bcrypt.compare(password, settings.adminPasswordHash || '');

        if (!validPassword) {
            return response.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '8h' });
        response.json({ token });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Internal server error' });
    }
};
