import express from 'express';
import authorization from '../middlewares/authMiddleware.js';
import {
    createJob,
    getAllJobs,
    updateJob,
    deleteJob,
    jobStats
} from '../controllers/job.js';

const router = express.Router();

// Routes

// Create a Job || POST
router.post('/create-job', authorization, createJob);

// Get Jobs || GET
router.get('/get-jobs', authorization, getAllJobs);

// Update Job || PATCH
router.patch('/update-job/:id', authorization, updateJob);

// Delete Jobs || DELETE
router.delete('/delete-job/:id', authorization, deleteJob);

// Job Filters || GET
router.get('/job-stats', authorization, jobStats);

export default router;