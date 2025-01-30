// API Documentation
// import swaggerUI from 'swagger-ui-express';
// import swaggerDoc from 'swagger-jsdoc';

// Importing Packages
import express from 'express';
// import 'express-async-errors';
import dotenv from 'dotenv';
import colors from 'colors';
import cors from 'cors';
import morgan from 'morgan';

// Security Packages
import helmet from 'helmet';
import xss from 'xss-clean';

dotenv.config();

// File Imports
import sequelize from './util/database.js';

// Defining Port
const PORT = process.env.PORT || 8080;

// Swagger API Config
// const options = {
//     definition: {
//         openapi: '3.0.0',
//         info: {
//             title: 'Job Portal App',
//             description: 'Node.JS/Express.JS Job Portal Project with MySQL'
//         },
//         servers: [{
//             url: `http://localhost:${PORT}`
//         }]
//     },
//     apis: ['./routes/*.js']
// };

// const spec = swaggerDoc(options);

// Models
import User from './models/users.js';
import Job from './models/jobs.js';

// Routes Imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/user.js';
import jobRoutes from './routes/job.js'
// import errorMiddleware from './middlewares/errorMiddleware.js';

const app = express();

// Middlewares
app.use(helmet());
app.use(xss());
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// App Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/job', jobRoutes);

// Home Route
// app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(spec));

// Validation Middleware
// app.use(errorMiddleware);

// Defining Database Relations
User.hasMany(Job);
Job.belongsTo(User);

// Initializing the Project
sequelize.sync({
        force: false
    })
    .then(
        app.listen(PORT, () => {
            console.log(`Server Running in ${process.env.DEV_MODE} Mode on Port ${PORT}.`
                .bgWhite.blue);
        }))
    .catch((err) => {
        console.log(`Error in DB - ${err}`.bgWhite.red);
    })