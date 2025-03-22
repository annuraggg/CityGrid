import type { Context } from "hono";
import Document from "../models/Document.js";
import { sendError, sendSuccess } from "../utils/sendResponse.js";
import logger from "../utils/logger.js";
import User from "../models/User.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import r2Client from "../config/s3.js";
import Project from "../models/Project.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { storeDocumentHash, verifyDocumentHash, getDocumentHash, compareHashes } from "../contracts/docVerifyBLC.js";
import crypto from "crypto";

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

const uploadDocument = async (c: Context) => {
  try {
    const auth = c.get("auth");

    if (!auth) {
      return sendError(c, 401, "Unauthorized");
    }

    const user = await User.findOne({ _id: auth._id });
    if (!user) {
      return sendError(c, 404, "User not found");
    }

    const formData = await c.req.formData();
    const file = formData.get("document");
    const projectId = formData.get("project");

    const id = Math.random().toString(36).substring(7);

    if (!file) {
      return sendError(c, 400, "No file found");
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return sendError(c, 404, "Project not found");
    }

    const fileBuffer = Buffer.from(await (file as File).arrayBuffer());
    const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

    const uploadParams = {
      Bucket: process.env.R2_DOC_BUCKET!,
      Key: `${project._id}/${id}.pdf`,
      Body: fileBuffer,
      ContentType: (file as File).type,
    };

    const upload = new Upload({
      client: r2Client,
      params: uploadParams,
    });

    const doc = new Document({
      name: (file as File).name,
      type: (file as File).type,
      id: id,
      hash: hash,
    });

    await doc.save();

    await storeDocumentHash(doc.id, hash);

    project.documents.push(doc._id);
    await project.save();

    await upload.done();

    return sendSuccess(c, 200, "Document uploaded successfully", {
      ...doc.toObject(),
      hash,
    });
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Internal Server Error");
  }
};

const getDocument = async (c: Context) => {
  try {
    const auth = c.get("auth");
    const projectId = c.req.param("projectId");
    const id = c.req.param("id");

    if (!auth) {
      return sendError(c, 401, "Unauthorized");
    }

    const user = await User.findOne({ _id: auth._id });

    if (!user) {
      return sendError(c, 404, "User not found");
    }

    // fetch resume from s3 and send it as a response

    const command = new GetObjectCommand({
      Bucket: process.env.R2_DOC_BUCKET!,
      Key: `${projectId}/${id}.pdf`,
    });

    const url = await getSignedUrl(r2Client, command, { expiresIn: 600 });

    return sendSuccess(c, 200, "Resume URL", { url });
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Internal Server Error");
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

const verifyDocument = async (c: Context) => {
  const documentId = c.req.param("id");

  try {
    // Find the document by the id field, not by MongoDB _id
    const document = await Document.findOne({ id: documentId });

    if (!document) {
      logger.error(`Document not found with id: ${documentId}`);
      return sendError(c, 404, "Document not found");
    }

    // Get the project to determine the S3 file path
    const project = await Project.findOne({ documents: document._id });
    if (!project) {
      logger.error(`Project not found for document: ${documentId}`);
      return sendError(c, 404, "Project not found for document");
    }

    // Get the file from S3
    const command = new GetObjectCommand({
      Bucket: process.env.R2_DOC_BUCKET!,
      Key: `${project._id}/${document.id}.pdf`,
    });

    const response = await r2Client.send(command);
    if (!response.Body) {
      logger.error(`Empty response body for document: ${documentId}`);
      return sendError(c, 500, "Failed to retrieve document file");
    }

    // Convert stream to buffer and calculate current hash
    const fileBuffer = await streamToBuffer(response.Body as any);
    const currentHash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

    // Compare with the stored hash on blockchain
    const isVerified = await compareHashes(document.id, currentHash);

    return sendSuccess(c, 200, "Document verification successful", { verified: isVerified });
  } catch (error) {
    logger.error(`Error in verifyDocument: ${error}`);
    return sendError(c, 500, "Failed to verify document");
  }
};

// Helper function to convert stream to buffer
const streamToBuffer = async (stream: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk: Buffer) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
};

export default {
  getDocuments,
  getDepartmentDocuments,
  createDocument,
  uploadDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  verifyDocument
};
