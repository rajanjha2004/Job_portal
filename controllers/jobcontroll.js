import jobsModel from "../model/job.js";
import mongoose from "mongoose";
import moment from "moment";
import job from "../model/job.js";
// ====== CREATE JOB ======
export const createJobController = async (req, res, next) => {
    const { company, position } = req.body;
    if (!company || !position) {
        next("Please Provide All Fields");
    }
    req.body.createdBy = req.loggeduser.userId;
    const job = await job.create(req.body);
    res.status(201).json({ job });
};

// ======= GET JOBS ===========
export const getAllJobsController = async (req, res, next) => {
    const { status, workType, search, sort } = req.query;
    //conditons for searching filters
    const queryObject = {
        createdBy: req.loggeduser.userId,
    };
    //logic filters
    if (status && status !== "all") {
        queryObject.status = status;
    }
    if (workType && workType !== "all") {
        queryObject.workType = workType;
    }
    if (search) {
        queryObject.position = { $regex: search, $options: "i" };
    }

    let queryResult = job.find(queryObject);

    //sorting
    if (sort === "latest") {
        queryResult = queryResult.sort("-createdAt");
    }
    if (sort === "oldest") {
        queryResult = queryResult.sort("createdAt");
    }
    if (sort === "a-z") {
        queryResult = queryResult.sort("position");
    }
    if (sort === "z-a") {
        queryResult = queryResult.sort("-position");
    }
    //pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    queryResult = queryResult.skip(skip).limit(limit);
    //jobs count
    const totalJobs = await job.countDocuments(queryResult);
    const numOfPage = Math.ceil(totalJobs / limit);

    const jobs = await queryResult;

    // const jobs = await jobsModel.find({ createdBy: req.user.userId });
    res.status(200).json({
        totalJobs,
        jobs,
        numOfPage,
    });
};

// ======= UPDATE JOBS ===========
export const updateJobController = async (req, res, next) => {
    const { id } = req.params;
    const { company, position } = req.body;
    //validation
    if (!company || !position) {
        next("Please Provide All Fields");
    }
    //find job
    const jobtoUpdate = await job.findOne({ _id: id });
    //validation
    if (!jobtoUpdate) {
        next(`no jobs found with this id ${id}`);
    }
    if (!req.loggeduser.userId === jobtoUpdate.createdBy.toString()) {
        next("Your Not Authorized to update this job");
        return;
    }
    const updateJob = await job.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
        runValidators: true,
    });
    //res
    res.status(200).json({ updateJob });
};

// ======= DELETE JOBS ===========
export const deleteJobController = async (req, res, next) => {
    const { id } = req.params;

    // Find job
    const jobToDelete = await job.findOne({ _id: id });

    // Validation: Check if job exists
    if (!jobToDelete) {
        return next(`No Job Found With This ID ${id}`);
    }

    // Validation: Check authorization
    if (req.loggeduser.userId !== jobToDelete.createdBy.toString()) {
        return next("You're Not Authorized to delete this job");
    }

    // Delete the job
    await jobToDelete.deleteOne();

    // Response
    res.status(200).json({ message: "Success, Job Deleted!" });
};


// =======  JOBS STATS & FILTERS ===========
export const jobStatsController = async (req, res) => {
    const stats = await job.aggregate([
        // search by user jobs
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.loggeduser.userId),
            },
        },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);

    //default stats
    const defaultStats = {
        pending: stats.pending || 0,
        reject: stats.reject || 0,
        interview: stats.interview || 0,
    };

    //monthly yearly stats
    let monthlyApplication = await job.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.loggeduser.userId),
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                },
                count: {
                    $sum: 1,
                },
            },
        },
    ]);
    monthlyApplication = monthlyApplication
        .map((item) => {
            const {
                _id: { year, month },
                count,
            } = item;
            const date = moment()
                .month(month - 1)
                .year(year)
                .format("MMM Y");
            return { date, count };
        })
        .reverse();
    res
        .status(200)
        .json({ totlaJob: stats.length, defaultStats, monthlyApplication });
};