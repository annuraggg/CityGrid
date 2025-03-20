import "dotenv/config";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";

import performanceMiddleware from "../middlewares/performanceMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";

import "../utils/logger";
import "./db";
import "./loops";
import "./clerk";
import { clerkMiddleware } from "@hono/clerk-auth";
import { serve } from "@hono/node-server";
const port = parseInt(process.env.PORT!);

import userRoutes from "../routes/userRoutes.js";
import conflictRoutes from "../routes/conflictRoutes.js";
import departmentRoutes from "../routes/departmentRoutes.js";
import documentRoutes from "../routes/documentRoutes.js";
import notificationRoutes from "../routes/notificationRoutes.js";
import projectRoutes from "../routes/projectRoutes.js";
import resourceRoutes from "../routes/resourceRoutes.js";
import inviteRoutes from "../routes/inviteRoutes.js";

const app = new Hono();
serve({
  fetch: app.fetch,
  port: port,
});

app.use(clerkMiddleware());
app.use(prettyJSON());
app.use(cors());
app.use(authMiddleware);
app.use(performanceMiddleware);

app.route("/users", userRoutes);
app.route("/conflicts", conflictRoutes);
app.route("/departments", departmentRoutes);
app.route("/documents", documentRoutes);
app.route("/notifications", notificationRoutes);
app.route("/projects", projectRoutes);
app.route("/resources", resourceRoutes);
app.route("/invites", inviteRoutes);

export default app;
