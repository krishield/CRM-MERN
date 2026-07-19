import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Settings from '../schema/settings-schema.js'

export const login = async (request, response) => {
    try {
        const { username, password } = request.body;

        const validUser = username === process.env.ADMIN_USER;
        let settings = await Settings.findOne({});
        const storedHash = (settings && settings.adminPasswordHash) || process.env.ADMIN_PASS_HASH;
        const validPassword = validUser && await bcrypt.compare(password, storedHash || '');

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
