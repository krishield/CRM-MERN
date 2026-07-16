import jwt from "jsonwebtoken";

const authMiddleware = (request, response, next) => {
    const header = request.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return response.status(401).json({ message: 'No token provided' });
    }

    const token = header.split(' ')[1];

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        response.status(401).json({ message: 'Invalid or expired token' });
    }
}

export default authMiddleware;
