import type { Context } from "hono";
import Conflict from "../models/Conflict.js";
import { sendError, sendSuccess } from "../utils/sendResponse.js";
import logger from "../utils/logger.js";
import Project from "../models/Project.js";

const checkConflicts = async (c: Context) => {
  try {
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
      return sendError(
        c,
        409,
        "Conflicts found for date and location",
        conflictingProjects
      );
    }

    return sendSuccess(c, 200, "No conflicts", []);
  } catch (error) {
    console.error("Error checking conflicts:", error);
    return sendError(c, 500, "Failed to check conflicts");
  }
};

const getConflicts = async (c: Context) => {
  try {
    const conflicts = await Conflict.find().lean();
    return sendSuccess(c, 200, "Conflicts fetched successfully", conflicts);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch conflicts");
  }
};

const getDepartmentConflicts = async (c: Context) => {
  const departmentId = c.get("auth").departmentId;

  try {
    const conflicts = await Conflict.find({ department: departmentId }).lean();
    return sendSuccess(c, 200, "Conflicts fetched successfully", conflicts);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch conflicts");
  }
};

const createConflict = async (c: Context) => {
  const { data } = await c.req.json();

  try {
    const conflict = await Conflict.create(data);
    return sendSuccess(c, 200, "Conflict created successfully", conflict);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to create conflict");
  }
};

const getConflict = async (c: Context) => {
  const id = c.req.param("id");

  try {
    const conflict = await Conflict.findById(id).lean();
    if (!conflict) {
      return sendError(c, 404, "Conflict not found");
    }
    return sendSuccess(c, 200, "Conflict fetched successfully", conflict);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch conflict");
  }
};

const updateConflict = async (c: Context) => {
  const id = c.req.param("id");
  const { data } = await c.req.json();

  try {
    const conflict = await Conflict.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!conflict) {
      return sendError(c, 404, "Conflict not found");
    }

    return sendSuccess(c, 200, "Conflict updated successfully", conflict);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to update conflict");
  }
};

const deleteConflict = async (c: Context) => {
  const id = c.req.param("id");

  try {
    const conflict = await Conflict.findByIdAndDelete(id);
    if (!conflict) {
      return sendError(c, 404, "Conflict not found");
    }

    return sendSuccess(c, 200, "Conflict deleted successfully", conflict);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to delete conflict");
  }
};

export default {
  getConflicts,
  getDepartmentConflicts,
  createConflict,
  getConflict,
  updateConflict,
  deleteConflict,
  checkConflicts,
};
