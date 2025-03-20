import type { Context } from "hono";
import Conflict from "../models/Conflict.js";
import { sendError, sendSuccess } from "../utils/sendResponse.js";
import logger from "../utils/logger.js";

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
};
