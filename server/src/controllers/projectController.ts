import type { Context } from "hono";
import Project from "../models/Project.js";
import { sendError, sendSuccess } from "../utils/sendResponse.js";
import logger from "../utils/logger.js";

const getProject = async (c: Context) => {
  const id = c.req.param("id");

  try {
    const project = await Project.findById(id).lean();
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
    const projects = await Project.find().lean();
    return sendSuccess(c, 200, "Projects fetched successfully", projects);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch projects");
  }
};

const createProject = async (c: Context) => {
  const { data } = await c.req.json();

  try {
    const project = await Project.create(data);
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

export default {
  getProject,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getDepartmentProjects,
};
