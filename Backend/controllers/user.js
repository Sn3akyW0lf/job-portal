import User from "../models/users.js";
import JWT from 'jsonwebtoken';

export const updateUser = async (req, res, next) => {
    const {
        name,
        lastName,
        email,
        location
    } = req.body;

    if (!name || !lastName || !email || !location) {
        return res.status(400).json({
            success: false,
            message: 'Please Provide all the Fields'
        })
    }

    const user = await User.findOne({
        where: {
            id: req.user.userId
        }
    });
    // user.name = name;
    // user.lastName = lastName
    // user.email = email
    // user.location = location

    await User.update({
        name: name,
        lastName: lastName,
        email: email,
        location: location
    }, {
        where: {
            id: req.user.userId
        }
    });
    const token = JWT.sign({
        userId: user.id
    }, process.env.TOKEN_SECRET, {
        expiresIn: '1d'
    });

    return res.status(200).json({
        user: {
            name: `${user.name} ${user.lastName}`,
            email: user.email,
            location: user.location
        },
        token
    })
};