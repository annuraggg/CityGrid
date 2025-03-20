import type { Context } from "hono";
import clerkClient from "../config/clerk.js";
import { sendError, sendSuccess } from "../utils/sendResponse.js";
import PendingInvite from "../models/PendingInvite.js";

const inviteProjectManager = async (c: Context) => {
  try {
    const { email } = await c.req.json();
    const auth = c.get("auth");

    console.log(email);
    console.log(auth);

    const clerkUser = await clerkClient.users.getUser(auth.userId);
    if (!clerkUser) {
      return sendError(c, 404, "User not found");
    }

    const department = clerkUser.publicMetadata.department;
    if (!department) {
      return sendError(c, 400, "Department not found");
    }

    await clerkClient.invitations.createInvitation({
      emailAddress: email,
      publicMetadata: {
        department,
        role: "pm",
      },
    });

    const newPendingInvite = new PendingInvite({
      email,
      department,
      role: "pm",
      redirectUrl: "http://localhost:5173/invite/pm",
    });
    await newPendingInvite.save();

    return sendSuccess(c, 201, "Project Manager invited successfully");
  } catch (error) {
    console.log(error);
    return sendError(c, 500, "Internal Server Error");
  }
};

const inviteHod = async (c: Context) => {
  try {
    const { email } = await c.req.json();
    const auth = c.get("auth");

    console.log(email);
    console.log(auth);

    const clerkUser = await clerkClient.users.getUser(auth.userId);
    if (!clerkUser) {
      return sendError(c, 404, "User not found");
    }

    const department = clerkUser.publicMetadata.department;
    if (!department) {
      return sendError(c, 400, "Department not found");
    }

    await clerkClient.invitations.createInvitation({
      emailAddress: email,
      publicMetadata: {
        department,
        role: "hod",
      },
      redirectUrl: "http://localhost:5173/invite/hod",
    });

    const newPendingInvite = new PendingInvite({
      email,
      department,
      role: "hod",
    });
    await newPendingInvite.save();

    return sendSuccess(c, 201, "HOD invited successfully");
  } catch (error) {
    return sendError(c, 500, "Internal Server Error");
  }
};

export default {
  inviteProjectManager,
  inviteHod,
};
