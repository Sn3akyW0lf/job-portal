import Job from "../models/jobs.js";
import moment from 'moment';
import Sequelize from 'sequelize';
const Op = Sequelize.Op;

// ====== Creating a New Job =======
export const createJob = async (req, res) => {
    try {
        const {
            company,
            position
        } = req.body;

        // Validation

        if (!company) {
            return res.status(400).json({
                success: false,
                message: 'Company Name is Required'
            })
        }

        if (!position) {
            return res.status(400).json({
                success: false,
                message: 'Job Position is Required'
            })
        }

        req.body.userId = req.user.userId;

        // Creating the Job
        const job = await Job.create(
            req.body
        );

        return res.status(201).json({
            message: 'Job Created Successfully',
            job
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error!'
        })
    }
};

// ====== Getting All Current Jobs ======
export const getAllJobs = async (req, res) => {

    try {
        const {
            status,
            workType,
            search,
            sort
        } = req.query

        // Checking Conditions for Search Filters
        const queryObj = {
            userId: req.user.userId
        }

        // Logic for Filters
        if (status && status !== 'all') {
            queryObj.status = status
        }

        if (workType && workType !== 'all') {
            queryObj.workType = workType
        }

        if (search) {
            queryObj.position = {
                [Op.like]: `%${search}%`
            }
        }


        // Sorting Logic
        const orderArr = []

        if (sort === 'latest') {
            orderArr.push(['createdAt', 'DESC'])
        }

        if (sort === 'oldest') {
            orderArr.push(['createdAt', 'ASC'])
        }

        if (sort === 'a-z') {
            orderArr.push(['position', 'ASC'])
        }

        if (sort === 'z-a') {
            orderArr.push(['position', 'DESC'])
        }

        // Pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const totalJobs = await Job.count({
            where: {
                userId: req.user.userId
            },
            order: orderArr,
            limit: limit,
            offset: offset
        });

        const numOfPages = Math.ceil(totalJobs / limit);

        const jobs = await Job.findAll({
            where: queryObj,
            order: orderArr,
            limit: limit,
            offset: offset
        });

        // const jobs = await Job.findAll({
        //     userId: req.user.userId
        // });
        res.status(200).json({
            totalJobs: jobs.length,
            jobs,
            numOfPages,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server error!'
        })
    }

};

// ====== Update a Job ======
export const updateJob = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const {
            company,
            position
        } = req.body;

        // Validation
        if (!company || !position) {
            return res.status(400).json({
                success: false,
                message: 'Please Provide Required Fields'
            })
        }

        // Find if Job Exists
        const job = await Job.findOne({
            where: {
                id: id
            }
        });

        // Update the Job if Exists and send Response
        if (job) {
            if (req.user.userId === job.userId) {
                const updatedJob = await Job.update(req.body, {
                    where: {
                        id: id
                    }
                });
                const modJob = await Job.findOne({
                    where: {
                        id: job.id
                    }
                });

                return res.status(200).json({
                    message: 'Job Updated Successfully',
                    modJob
                });
            } else {
                return res.status(401).json({
                    message: 'Sorry, You are Not Authorized to Modify this Job.'
                })
            }
        } else {
            return res.status(404).json({
                message: 'No Job Found with Given ID.'
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server error!'
        })
    }
};

// ====== Deleting a Job Posting ========
export const deleteJob = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        // Check if Job Exists
        const job = await Job.findOne({
            where: {
                id: id
            }
        })

        // Delete Job if Found and send Response
        if (job) {
            if (req.user.userId === job.userId) {
                const deleteJob = await Job.destroy({
                    where: {
                        id: id
                    }
                });

                return res.status(200).json({
                    message: 'Job Deleted Successfully'
                });
            } else {
                return res.status(401).json({
                    message: 'Sorry, You are Not Authorized to Modify this Job.'
                })
            }
        } else {
            return res.status(404).json({
                message: 'No Job Found with Given ID.'
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server error!'
        })
    }
};

// ====== Job Stats & Filters ========
export const jobStats = async (req, res) => {
    try {
        const stats = await Job.findAll({
            attributes: ['status', [
                Job.sequelize.fn('COUNT', Job.sequelize.col('status')), 'count'
            ]],
            group: 'status',
            where: {
                userId: req.user.userId
            },
            raw: true
        });

        let jobByMonth = await Job.findAll({
            attributes: [
                [
                    Job.sequelize.fn('MONTH', Job.sequelize.col('createdAt')), 'month'
                ],
                [
                    Job.sequelize.fn('YEAR', Job.sequelize.col('createdAt')), 'year'
                ],
                [
                    Job.sequelize.fn('count', '*'), 'count'
                ]
            ],
            group: [
                'month', 'year'
            ]
        });

        // Retriving and Formating the Applications by Month

        jobByMonth = jobByMonth.map(item => {
            const {
                month,
                year,
                count
            } = item.dataValues;

            const date = moment().month(month - 1).year(year).format('MMM Y');
            return {
                date,
                count
            }
        }).reverse();

        // Stat Formatting
        const formatStat = {
            pending: stats[0].count || 0,
            interviewing: stats[1].count || 0,
            rejected: stats[2].count || 0
        }

        return res.status(200).json({
            stats: formatStat,
            jobsByMonth: jobByMonth
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server error!'
        })
    }
};