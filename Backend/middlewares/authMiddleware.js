import JWT from 'jsonwebtoken';

const authorization = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(400).json({
            message: 'Auth Failed'
        })
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = JWT.verify(token, process.env.TOKEN_SECRET);

        req.user = {
            userId: payload.userId
        };
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Session Timed Out Please Signin Again'
            });
        } else {
            return res.status(500).json({
                message: 'Something Went Wrong - Please Signin Again'
            });
        }
    }
}

export default authorization;