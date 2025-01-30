// Error Middleware

const errorMiddleware = (err, req, res, next) => {
    const {
        name,
        lastName,
        email,
        password
    } = req.body;

    res.status(500).json({
        success: false,
        message: 'Something went wrong',
        err
    })
};

export default errorMiddleware;