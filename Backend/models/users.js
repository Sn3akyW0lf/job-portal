import Sequelize from 'sequelize';
import sequelize from '../util/database.js';

const User = sequelize.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
                args: true,
                msg: 'Name is Required'
            }

        }
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
                args: true,
                msg: 'Surame or Last Name is Required'
            }
        }
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                args: true,
                msg: 'Email is Required'
            },
            isEmail: {
                args: true,
                msg: 'Valid Email is Required'
            }

        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
                args: true,
                msg: 'Password is Required'
            },
            len: {
                args: 6,
                msg: 'Password Should Longer than 6 Characters'
            }

        }
    },
    location: {
        type: Sequelize.STRING,
        defaultValue: 'Mumbai'
    }
});

export default User;