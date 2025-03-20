import type { Context } from "hono";
import Resource from "../models/Resource.js";
import { sendError, sendSuccess } from "../utils/sendResponse.js";
import logger from "../utils/logger.js";

const getResources = async (c: Context) => {
  try {
    const resources = await Resource.find().populate("sharedWith").lean();
    return sendSuccess(c, 200, "Resources fetched successfully", resources);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch resources");
  }
};

const createResource = async (c: Context) => {
  const { data } = await c.req.json();
  const auth = c.get("auth");

  try {
    const resource = await Resource.create(data);
    if (auth.departmentId !== resource.department?.toString()) {
      return sendError(
        c,
        403,
        "You are not authorized to create this resource"
      );
    }
    return sendSuccess(c, 200, "Resource created successfully", resource);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to create resource");
  }
};

const getResource = async (c: Context) => {
  const id = c.req.param("id");

  try {
    const resource = await Resource.findById(id).populate("sharedWith").lean();
    if (!resource) {
      return sendError(c, 404, "Resource not found");
    }
    return sendSuccess(c, 200, "Resource fetched successfully", resource);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch resource");
  }
};

const updateResource = async (c: Context) => {
  const id = c.req.param("id");
  const { data } = await c.req.json();
  const auth = c.get("auth");

  try {
    const resource = await Resource.findById(id);
    if (!resource) {
      return sendError(c, 404, "Resource not found");
    }
    if (auth.departmentId !== resource.department?.toString()) {
      return sendError(
        c,
        403,
        "You are not authorized to update this resource"
      );
    }
    await resource.updateOne(data);
    return sendSuccess(c, 200, "Resource updated successfully");
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to update resource");
  }
};

const deleteResource = async (c: Context) => {
  const id = c.req.param("id");
  const auth = c.get("auth");

  try {
    const resource = await Resource.findById(id);
    if (!resource) {
      return sendError(c, 404, "Resource not found");
    }
    if (auth.departmentId !== resource.department?.toString()) {
      return sendError(
        c,
        403,
        "You are not authorized to delete this resource"
      );
    }
    await resource.deleteOne();
    return sendSuccess(c, 200, "Resource deleted successfully");
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to delete resource");
  }
};

export default {
  getResources,
  createResource,
  getResource,
  updateResource,
  deleteResource,
};
