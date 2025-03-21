import type { Context } from "hono";
import Project from "../models/Project.js";
import { sendError, sendSuccess } from "../utils/sendResponse.js";
import logger from "../utils/logger.js";
import User from "../models/User.js";
import Conflict from "../models/Conflict.js";

const getProject = async (c: Context) => {
  const id = c.req.param("id");

  try {
    const project = await Project.findById(id)
      .populate("documents")
      .populate("manager")
      .populate("department")
      .lean();
    if (!project) {
      return sendError(c, 404, "Project not found");
    }
    return sendSuccess(c, 200, "Project fetched successfully", project);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch project");
  }
};

const getProjects = async (c: Context) => {
  try {
    const projects = await Project.find()
      .populate("documents")
      .populate("manager")
      .lean();
    return sendSuccess(c, 200, "Projects fetched successfully", projects);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch projects");
  }
};

const createProject = async (c: Context) => {
  const data = await c.req.json();
  console.log(c.get("auth"));

  try {
    const user = await User.findById(c.get("auth")?._id);
    if (!user) {
      return sendError(c, 404, "User not found");
    }
    const project = await Project.create({
      ...data,
      _id: undefined,
      manager: c.get("auth")?._id,
      department: user?.department,
    });
    return sendSuccess(c, 200, "Project created successfully", project);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to create project");
  }
};

const updateProject = async (c: Context) => {
  const id = c.req.param("id");
  const { data } = await c.req.json();

  try {
    const project = await Project.findByIdAndUpdate(id, data, { new: true });
    if (!project) {
      return sendError(c, 404, "Project not found");
    }
    return sendSuccess(c, 200, "Project updated successfully", project);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to update project");
  }
};

const deleteProject = async (c: Context) => {
  const id = c.req.param("id");

  try {
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return sendError(c, 404, "Project not found");
    }
    return sendSuccess(c, 200, "Project deleted successfully", project);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to delete project");
  }
};

const getDepartmentProjects = async (c: Context) => {
  const department = c.req.param("department");

  try {
    const projects = await Project.find({ department }).lean();
    return sendSuccess(c, 200, "Projects fetched successfully", projects);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch projects");
  }
};

const getManagerProjects = async (c: Context) => {
  const manager = c.get("auth")?._id;
  try {
    const projects = await Project.find({ manager }).lean();
    console.log(projects);
    return sendSuccess(c, 200, "Projects fetched successfully", projects);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch projects");
  }
};

const createConflict = async (c: Context) => {
  const data = await c.req.json();

  try {
    const user = await User.findById(c.get("auth")?._id);
    if (!user) {
      return sendError(c, 404, "User not found");
    }
    const project = await Project.create({
      ...data,
      _id: undefined,
      manager: c.get("auth")?._id,
      department: user?.department,
    });

    const { schedule, location } = await c.req.json();
    const { longitude, latitude } = location;
    const { start, end } = schedule;

    console.log("Check conflicts:", { start, end, longitude, latitude });
    const locationThreshold = 0.001;

    const conflictingProjects = await Project.find({
      $and: [
        {
          $or: [
            {
              $and: [
                { "schedule.start": { $lte: new Date(start) } },
                { "schedule.end": { $gte: new Date(start) } },
              ],
            },
            {
              $and: [
                { "schedule.start": { $lte: new Date(end) } },
                { "schedule.end": { $gte: new Date(end) } },
              ],
            },
            {
              $and: [
                { "schedule.start": { $gte: new Date(start) } },
                { "schedule.end": { $lte: new Date(end) } },
              ],
            },
          ],
        },
        {
          $and: [
            { "location.longitude": { $gte: longitude - locationThreshold } },
            { "location.longitude": { $lte: longitude + locationThreshold } },
            { "location.latitude": { $gte: latitude - locationThreshold } },
            { "location.latitude": { $lte: latitude + locationThreshold } },
          ],
        },
      ],
    });

    if (conflictingProjects.length) {
      for (const conflicProject of conflictingProjects) {
        const newConflic = new Conflict({
          project: project._id,
          conflictingProject: conflicProject._id,
        });

        await newConflic.save();
      }
    }

    return sendSuccess(c, 200, "Project created successfully", project);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to create project");
  }
};

export default {
  getProject,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getDepartmentProjects,
  getManagerProjects,
  createConflict,
};
