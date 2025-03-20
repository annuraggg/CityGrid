import { Hono } from "hono";
import projectController from "../controllers/projectController.js";
const app = new Hono();

app.post("/", projectController.createProject);
app.get("/", projectController.getProjects);
app.get("/manager", projectController.getManagerProjects);
app.get("/department/:departmentId", projectController.getDepartmentProjects);
app.get("/:id", projectController.getProject);
app.put("/:id", projectController.updateProject);
app.delete("/:id", projectController.deleteProject);

export default app;
