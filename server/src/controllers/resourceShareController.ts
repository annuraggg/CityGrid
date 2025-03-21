import type { Context } from "hono";
import ResourceShare from "../models/ResourceShare.js";
import { sendError, sendSuccess } from "../utils/sendResponse.js";
import logger from "../utils/logger.js";
import clerkClient from "../config/clerk.js";
import Resource from "../models/Resource.js";
import User from "../models/User.js";

const createResourceShare = async (c: Context) => {
  try {
    const { resource, quantity, sharedWith, project } = await c.req.json();
    const res = await Resource.findOne({ _id: resource });
    if (!res) {
      return sendError(c, 404, "Resource not found");
    }

    if (res.quantity < quantity) {
      return sendError(c, 400, "Requested quantity not available");
    }

    const resourceShare = new ResourceShare({
      resource,
      department: res.department,
      quantity,
      sharedWith,
      project: project,
    });

    await resourceShare.save();

    return sendSuccess(
      c,
      201,
      "Resource requested successfully",
      resourceShare
    );
  } catch (error) {
    return sendError(c, 500, "Internal Server Error");
  }
};

const getDepartmentShareRequests = async (c: Context) => {
  try {
    const { department } = await c.req.json();
    const resourceShares = await ResourceShare.find({
      department: department,
    })
      .populate("resource")
      .populate("sharedWith");

    console.log(resourceShares);
    console.log(department);

    return sendSuccess(
      c,
      200,
      "Resource shares fetched successfully",
      resourceShares
    );
  } catch (error) {
    return sendError(c, 500, "Internal Server Error");
  }
}

const getDepartmentRequests = async (c: Context) => {
  try {
    const { department } = await c.req.json();

    const resourceShares = await ResourceShare.find({
      sharedWith: department
    })
      .populate("resource")
      .populate("sharedWith");

    console.log(resourceShares);

    return sendSuccess(
      c,
      200,
      "Resource shares fetched successfully",
      resourceShares
    );
  } catch (error) {
    return sendError(c, 500, "Internal Server Error");
  }
}

export default { getDepartmentShareRequests, createResourceShare, getDepartmentRequests };
