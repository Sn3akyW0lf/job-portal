// Importing Packages
import express from 'express';
// import 'express-async-errors';
import dotenv from 'dotenv';
import colors from 'colors';
import cors from 'cors';
import morgan from 'morgan';

dotenv.config();

// File Imports
import sequelize from './util/database.js';

// Models
import User from './models/users.js';

// Routes Imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/user.js';
// import errorMiddleware from './middlewares/errorMiddleware.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// App Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);

// Validation Middleware
// app.use(errorMiddleware);

// Defining Port
const PORT = process.env.PORT || 8080;

// Initializing the Project
sequelize.sync()
    .then(
        app.listen(PORT, () => {
            console.log(`Server Running in ${process.env.DEV_MODE} Mode on Port ${PORT}.`
                .bgWhite.blue);
        }))
    .catch((err) => {
        console.log(`Error in DB - ${err}`.bgWhite.red);
    })