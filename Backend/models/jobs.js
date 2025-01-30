import Sequelize from 'sequelize';
import sequelize from '../util/database.js';

const Job = sequelize.define('job', {
    company: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
                args: true,
                msg: 'Company Name is Required'
            }
        }
    },
    position: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
                args: true,
                msg: 'Job Position is Required'
            }
        }
    },
    status: {
        type: Sequelize.ENUM('pending', 'rejected', 'interview'),
        // values: ['pending', 'rejected', 'interview'],
        defaultValue: 'pending'
    },
    workType: {
        type: Sequelize.ENUM('permanent', 'part-time', 'internship', 'contract'),
        // values: ['permanent', 'part-time', 'internship', 'contract'],
        defaultValue: 'permanent'
    },
    workLocation: {
        type: Sequelize.STRING,
        defaultValue: 'Mumbai',
        allowNull: false,
        validate: {
            notNull: {
                args: true,
                msg: 'Job Loaction is Required'
            }
        }
    },

});

export default Job;