import type { Context } from "hono";
import Project from "../models/Project.js";
import { sendError, sendSuccess } from "../utils/sendResponse.js";
import logger from "../utils/logger.js";
import User from "../models/User.js";
import Conflict from "../models/Conflict.js";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const getProject = async (c: Context) => {
  const id = c.req.param("id");

  try {
    const project = await Project.findById(id)
      .populate("documents")
      .populate("manager")
      .populate("department")
      .lean();
    if (!project) {
      return sendError(c, 404, "Project not found");
    }
    return sendSuccess(c, 200, "Project fetched successfully", project);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch project");
  }
};

const getProjects = async (c: Context) => {
  try {
    const projects = await Project.find()
      .populate("documents")
      .populate("manager")
      .lean();
    return sendSuccess(c, 200, "Projects fetched successfully", projects);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch projects");
  }
};

const createProject = async (c: Context) => {
  const data = await c.req.json();
  console.log(c.get("auth"));

  try {
    const user = await User.findById(c.get("auth")?._id);
    if (!user) {
      return sendError(c, 404, "User not found");
    }
    const project = await Project.create({
      ...data,
      _id: undefined,
      manager: c.get("auth")?._id,
      department: user?.department,
    });
    return sendSuccess(c, 200, "Project created successfully", project);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to create project");
  }
};

const updateProject = async (c: Context) => {
  const id = c.req.param("id");
  const { data } = await c.req.json();

  try {
    const project = await Project.findByIdAndUpdate(id, data, { new: true });
    if (!project) {
      return sendError(c, 404, "Project not found");
    }
    return sendSuccess(c, 200, "Project updated successfully", project);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to update project");
  }
};

const deleteProject = async (c: Context) => {
  const id = c.req.param("id");

  try {
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return sendError(c, 404, "Project not found");
    }
    return sendSuccess(c, 200, "Project deleted successfully", project);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to delete project");
  }
};

const getDepartmentProjects = async (c: Context) => {
  const department = c.req.param("department");

  try {
    const projects = await Project.find({ department }).lean();
    return sendSuccess(c, 200, "Projects fetched successfully", projects);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch projects");
  }
};

const getManagerProjects = async (c: Context) => {
  const manager = c.get("auth")?._id;
  try {
    const projects = await Project.find({ manager }).lean();
    console.log(projects);
    return sendSuccess(c, 200, "Projects fetched successfully", projects);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch projects");
  }
};

const createConflict = async (c: Context) => {
  const data = await c.req.json();

  try {
    const user = await User.findById(c.get("auth")?._id);
    if (!user) {
      return sendError(c, 404, "User not found");
    }
    const project = await Project.create({
      ...data,
      _id: undefined,
      manager: c.get("auth")?._id,
      department: user?.department,
    });

    const { schedule, location } = await c.req.json();
    const { longitude, latitude } = location;
    const { start, end } = schedule;

    console.log("Check conflicts:", { start, end, longitude, latitude });
    const locationThreshold = 0.001;

    const conflictingProjects = await Project.find({
      $and: [
        {
          $or: [
            {
              $and: [
                { "schedule.start": { $lte: new Date(start) } },
                { "schedule.end": { $gte: new Date(start) } },
              ],
            },
            {
              $and: [
                { "schedule.start": { $lte: new Date(end) } },
                { "schedule.end": { $gte: new Date(end) } },
              ],
            },
            {
              $and: [
                { "schedule.start": { $gte: new Date(start) } },
                { "schedule.end": { $lte: new Date(end) } },
              ],
            },
          ],
        },
        {
          $and: [
            { "location.longitude": { $gte: longitude - locationThreshold } },
            { "location.longitude": { $lte: longitude + locationThreshold } },
            { "location.latitude": { $gte: latitude - locationThreshold } },
            { "location.latitude": { $lte: latitude + locationThreshold } },
          ],
        },
      ],
    });

    if (conflictingProjects.length) {
      for (const conflicProject of conflictingProjects) {
        const newConflic = new Conflict({
          project: project._id,
          conflictingProject: conflicProject._id,
        });

        await newConflic.save();
      }
    }

    return sendSuccess(c, 200, "Project created successfully", project);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to create project");
  }
};

const rescheduleProject = async (c: Context) => {
  const id = c.req.param("id");
  const { start, end } = await c.req.json();

  try {
    // check for conflicts
    const locationThreshold = 0.001;
    const project = await Project.findById(id);
    if (!project) {
      return sendError(c, 404, "Project not found");
    }

    const { longitude, latitude } = project.location!;

    const conflictingProjects = await Project.find({
      $and: [
        {
          $or: [
            {
              $and: [
                { "schedule.start": { $lte: new Date(start) } },
                { "schedule.end": { $gte: new Date(start) } },
              ],
            },
            {
              $and: [
                { "schedule.start": { $lte: new Date(end) } },
                { "schedule.end": { $gte: new Date(end) } },
              ],
            },
            {
              $and: [
                { "schedule.start": { $gte: new Date(start) } },
                { "schedule.end": { $lte: new Date(end) } },
              ],
            },
          ],
        },
        {
          $and: [
            { "location.longitude": { $gte: longitude - locationThreshold } },
            { "location.longitude": { $lte: longitude + locationThreshold } },
            { "location.latitude": { $gte: latitude - locationThreshold } },
            { "location.latitude": { $lte: latitude + locationThreshold } },
          ],
        },
      ],
    });

    if (conflictingProjects.length) {
      return sendError(
        c,
        409,
        "Conflicting projects found. Please choose a different time or location."
      );
    }

    const projectUpd = await Project.findByIdAndUpdate(
      id,
      { "schedule.start": start, "schedule.end": end },
      { new: true }
    );

    await Conflict.deleteMany({
      $or: [{ project: id }, { conflictingProject: id }],
    });

    if (!projectUpd) {
      return sendError(c, 404, "Project not found");
    }
    return sendSuccess(c, 200, "Project updated successfully", project);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to update project");
  }
};

const MODEL_NAME = "gemini-1.5-flash-8b";
const API_KEY = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const generationConfig = {
  temperature: 0,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
  stopSequences: ["Note"],
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const getLLMResponse = async (c: Context) => {
  const { conflictId } = await c.req.json();
  const conflict = await Conflict.findById(conflictId)
    .populate("project")
    .populate("conflictingProject")
    .lean();

  const appendTemplate =
    "Below Model contains 2 conflicting projects. study them and suggest a small paragraph to avoid the conflict and how to resolve it in most feasible way.";

  try {
    if (conflict) {
      const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [],
      });

      const message = `${appendTemplate} Model:  ${JSON.stringify(conflict)}`;

      const result = await chat.sendMessage(message);
      const response = result.response;
      const toText = response.text();

      return sendSuccess(c, 200, "Success", toText);
    }

    return sendError(c, 404, "Conflict not found");
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

export default {
  getProject,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getDepartmentProjects,
  getManagerProjects,
  createConflict,
  rescheduleProject,
  getLLMResponse,
};
