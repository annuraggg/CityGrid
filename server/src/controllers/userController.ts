import type { Context } from "hono";
import User from "../models/User.js";
import { sendError, sendSuccess } from "../utils/sendResponse.js";
import logger from "../utils/logger.js";
import clerkClient from "../config/clerk.js";
import PendingInvite from "../models/PendingInvite.js";

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
      department,
      name: data.first_name + " " + data.last_name,
      role,
    });

    await PendingInvite.deleteOne({
      email: email.email_address,
    });

    clerkClient.users.updateUser(id, {
      publicMetadata: {
        department,
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
  try {
    const users = await User.find({ department }).populate("department");
    return sendSuccess(c, 200, "Team fetched successfully", users);
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
