import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];
        console.log('Token received:', token);
        console.log('JWT Secret:', process.env.ACCESS_TOKEN);

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: Token missing" });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
            if (err) {
                console.log('JWT Error:', err);
                return res.status(401).json({ error: "Unauthorized: Invalid token" });
            }
            req.decoded = decoded;
            next();
        });
    } catch (error) {
        console.error('Internal server error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
