import type { Context } from "hono";
import User from "../models/User.js";
import { sendError, sendSuccess } from "../utils/sendResponse.js";
import logger from "../utils/logger.js";
import clerkClient from "../config/clerk.js";
import PendingInvite from "../models/PendingInvite.js";
import Department from "../models/Department.js";

const userCreated = async (c: Context) => {
  const { data } = await c.req.json();
  const { id, primary_email_address_id } = data;
  const email = data.email_addresses.find(
    (email: { id: string }) => email.id === primary_email_address_id
  );

  try {
    const pendingUser = await PendingInvite.findOne({
      email: email.email_address,
    });
    if (!pendingUser) {
      return sendError(c, 404, "User not found");
    }

    const { department, role } = pendingUser;

    const u = await User.create({
      clerkId: id,
      email: email.email_address,
      name: data.first_name + " " + data.last_name,
      role,
    });

    await PendingInvite.deleteOne({
      email: email.email_address,
    });

    if (role === "hod") {
      const newDepartment = await Department.create({
        hod: u._id,
      });

      await u.updateOne({
        department: newDepartment._id,
      });

      await newDepartment.save();
      await u.save();

      const meta = (await clerkClient.users.getUser(id)).publicMetadata;
      console.log(u._id);
      await clerkClient.users.updateUser(id, {
        publicMetadata: {
          ...meta,
          _id: u._id,
          department: newDepartment._id,
        },
      });

      const parentDept = await Department.findOne({
        _id: department,
      });

      if (parentDept) {
        await parentDept.updateOne({
          $push: {
            departments: newDepartment._id,
          },
        });
      }

      return sendSuccess(c, 200, "User created successfully");
    } else {
      await u.updateOne({
        department: department,
      });

      await u.save();
    }

    const meta = (await clerkClient.users.getUser(id)).publicMetadata;
    clerkClient.users.updateUser(id, {
      publicMetadata: {
        ...meta,
        role,
        _id: u._id,
      },
    });

    return sendSuccess(c, 200, "User created successfully");
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to create user");
  }
};

const userDeleted = async (c: Context) => {
  const { data } = await c.req.json();
  const { id } = data;

  try {
    const u = await User.findOne({ clerkId: id });
    if (u) {
      await u.deleteOne();
    }

    return sendSuccess(c, 200, "User deleted successfully");
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to delete user");
  }
};

const userUpdated = async (c: Context) => {
  const { data } = await c.req.json();
  const { id, primary_email_address_id } = data;
  const email = data.email_addresses.find(
    (email: { id: string }) => email.id === primary_email_address_id
  );

  try {
    const u = await User.findOne({ clerkId: id });

    if (!u) {
      sendError(c, 404, "User not found");
      return;
    }

    await u.updateOne({
      email: email.email_address,
    });

    return sendSuccess(c, 200, "User updated successfully");
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to update user");
  }
};

const getTeam = async (c: Context) => {
  const department = c.req.param("dept");
  const userId = c.get("auth")._id;
  try {
    const users = await User.find({
      department,
      _id: { $ne: [userId] },
    }).populate("department");
    const dep = await Department.findOne({ _id: department }).populate({
      path: "departments",
      populate: {
        path: "hod",
        populate: {
          path: "department", // Populate the department inside hod
        },
      },
    });

    const deptMap = dep?.departments.map((d) => {
      //@ts-ignore
      return d.hod;
    });

    if (!dep) {
      return sendError(c, 404, "Department not found");
    }

    //@ts-ignore
    const finalArr = [...users, ...deptMap];
    console.log(finalArr);
    return sendSuccess(c, 200, "Team fetched successfully", finalArr);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to get team");
  }
};

export default {
  userCreated,
  userDeleted,
  userUpdated,
  getTeam,
};
