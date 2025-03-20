import type { Context } from "hono";
import Document from "../models/Document.js";
import { sendError, sendSuccess } from "../utils/sendResponse.js";
import logger from "../utils/logger.js";

const getDocuments = async (c: Context) => {
  try {
    const documents = await Document.find().lean();
    return sendSuccess(c, 200, "Documents fetched successfully", documents);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch documents");
  }
};

const getDepartmentDocuments = async (c: Context) => {
  const departmentId = c.get("auth").departmentId;

  try {
    const documents = await Document.find({ department: departmentId }).lean();
    return sendSuccess(c, 200, "Documents fetched successfully", documents);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch documents");
  }
};

const createDocument = async (c: Context) => {
  const { data } = await c.req.json();

  try {
    const document = await Document.create(data);
    return sendSuccess(c, 200, "Document created successfully", document);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to create document");
  }
};

const getDocument = async (c: Context) => {
  const id = c.req.param("id");

  try {
    const document = await Document.findById(id).lean();
    if (!document) {
      return sendError(c, 404, "Document not found");
    }
    return sendSuccess(c, 200, "Document fetched successfully", document);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch document");
  }
};

const updateDocument = async (c: Context) => {
  const id = c.req.param("id");
  const { data } = await c.req.json();

  try {
    const document = await Document.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!document) {
      return sendError(c, 404, "Document not found");
    }
    return sendSuccess(c, 200, "Document updated successfully", document);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to update document");
  }
};

const deleteDocument = async (c: Context) => {
  const id = c.req.param("id");

  try {
    const document = await Document.findByIdAndDelete(id);
    if (!document) {
      return sendError(c, 404, "Document not found");
    }
    return sendSuccess(c, 200, "Document deleted successfully", document);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to delete document");
  }
};

export default {
  getDocuments,
  getDepartmentDocuments,
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
};
