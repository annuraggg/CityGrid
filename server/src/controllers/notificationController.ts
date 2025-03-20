import type { Context } from "hono";
import Notification from "../models/Notification.js";
import { sendError, sendSuccess } from "../utils/sendResponse.js";
import logger from "../utils/logger.js";

const getNotifications = async (c: Context) => {
  try {
    const notifications = await Notification.find().lean();
    return sendSuccess(
      c,
      200,
      "Notifications fetched successfully",
      notifications
    );
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch notifications");
  }
};

const getUserNotifications = async (c: Context) => {
  const userId = c.get("auth").userId;

  try {
    const notifications = await Notification.find({ user: userId }).lean();
    return sendSuccess(
      c,
      200,
      "Notifications fetched successfully",
      notifications
    );
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch notifications");
  }
};

const createNotification = async (c: Context) => {
  const { data } = await c.req.json();

  try {
    const notification = await Notification.create(data);
    return sendSuccess(
      c,
      200,
      "Notification created successfully",
      notification
    );
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to create notification");
  }
};

const getNotification = async (c: Context) => {
  const id = c.req.param("id");

  try {
    const notification = await Notification.findById(id).lean();
    if (!notification) {
      return sendError(c, 404, "Notification not found");
    }
    return sendSuccess(
      c,
      200,
      "Notification fetched successfully",
      notification
    );
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch notification");
  }
};

const markNotificationAsRead = async (c: Context) => {
  const id = c.req.param("id");

  try {
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    if (!notification) {
      return sendError(c, 404, "Notification not found");
    }
    return sendSuccess(
      c,
      200,
      "Notification marked as read successfully",
      notification
    );
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to mark notification as read");
  }
};

export default {
  getNotifications,
  getUserNotifications,
  createNotification,
  getNotification,
  markNotificationAsRead,
};
