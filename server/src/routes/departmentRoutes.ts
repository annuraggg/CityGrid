import { Hono } from "hono";
import departmentController from "../controllers/departmentController.js";
const app = new Hono();

app.post("/", departmentController.createDepartment);
app.get("/:id", departmentController.getDepartment);
app.put("/", departmentController.updateDepartment);
app.post("/:id/member", departmentController.addMember);
app.delete("/:id/member", departmentController.removeMember);

export default app;
