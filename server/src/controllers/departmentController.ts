import type { Context } from "hono";
import Department from "../models/Department.js";
import { sendError, sendSuccess } from "../utils/sendResponse.js";
import logger from "../utils/logger.js";

const getDepartments = async (c: Context) => {
  try {
    const departments = await Department.find().lean();
    return sendSuccess(c, 200, "Departments fetched successfully", departments);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch departments");
  }
};

const getDepartment = async (c: Context) => {
  const id = c.req.param("id");

  try {
    const department = await Department.findById(id).lean();
    if (!department) {
      return sendError(c, 404, "Department not found");
    }
    return sendSuccess(c, 200, "Department fetched successfully", department);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch department");
  }
};

const createDepartment = async (c: Context) => {
  const { data } = await c.req.json();

  try {
    const department = await Department.create(data);
    return sendSuccess(c, 200, "Department created successfully", department);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to create department");
  }
};

const updateDepartment = async (c: Context) => {
  const id = c.req.param("id");
  const { data } = await c.req.json();

  try {
    const department = await Department.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!department) {
      return sendError(c, 404, "Department not found");
    }
    return sendSuccess(c, 200, "Department updated successfully", department);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to update department");
  }
};

const addMember = async (c: Context) => {
  const id = c.req.param("id");
  const { memberId } = await c.req.json();

  try {
    const department = await Department.findById(id);
    if (!department) {
      return sendError(c, 404, "Department not found");
    }
    department.members.push(memberId);
    await department.save();
    return sendSuccess(
      c,
      200,
      "Member added to department successfully",
      department
    );
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to add member to department");
  }
};

const removeMember = async (c: Context) => {
  const id = c.req.param("id");
  const { memberId } = await c.req.json();

  try {
    const department = await Department.findById(id);
    if (!department) {
      return sendError(c, 404, "Department not found");
    }
    department.members = department.members.filter(
      (member) => member.toString() !== memberId
    );
    await department.save();
    return sendSuccess(
      c,
      200,
      "Member removed from department successfully",
      department
    );
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to remove member from department");
  }
};

export default {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  addMember,
  removeMember,
};
