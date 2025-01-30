import User from "../models/users.js";
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';

const saltRounds = 10;
const secretKey = process.env.TOKEN_SECRET;

export const registerUser = async (req, res, next) => {
    try {
        const {
            name,
            lastName,
            email,
            password
        } = req.body;

        // Validating the Data

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Name is Required'
            })
        }

        if (!lastName) {
            return res.status(400).json({
                success: false,
                message: 'Surname or Last Name is Required'
            })
        }

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is Required'
            })
        }

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Password is Required'
            })
        }

        const existingUser = await User.findOne({
            where: {
                email: email
            }
        });

        if (existingUser) {
            return res.status(200).json({
                success: false,
                message: 'Email is Already Registered, Please Login'
            })
        }

        const hash = await bcrypt.hash(password, saltRounds);
        const user = await User.create({
            name,
            lastName,
            email,
            password: hash
        });

        const token = JWT.sign({
            userId: user.id
        }, secretKey, {
            expiresIn: '1d'
        });

        return res.status(201).json({
            message: 'User Created Successfully',
            user: {
                name: `${user.name} ${user.lastName}`,
                email: user.email,
                location: user.location
            },
            token
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Error in Register Controller',
            error
        })
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const {
            email,
            password
        } = req.body;

        // Validation
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is Required'
            })
        }

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Password is Required'
            })
        }

        // Find the user
        const user = await User.findOne({
            where: {
                email: email
            }
        });

        // Validate the User
        if (user) {
            const isValidPass = await bcrypt.compare(password, user.password);

            if (isValidPass) {
                const token = JWT.sign({
                    userId: user.id
                }, secretKey, {
                    expiresIn: '1d'
                });
                return res.status(200).json({
                    message: 'Email, Password Correct',
                    user: {
                        name: `${user.name}  ${user.lastName}`,
                        email: user.email,
                        location: user.location
                    },
                    token
                })
            } else {
                return res.status(401).json({
                    message: 'Invalid Email or Password!'
                })
            }
        } else {
            return res.status(409).json({
                success: false,
                message: 'Invalid Email or Password!'
            })
        }

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Error in Login Controller',
            error
        })
    }
};