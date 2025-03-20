import { Hono } from "hono";
import conflictController from "../controllers/conflictController.js";
const app = new Hono();

app.post("/", conflictController.createConflict);
app.get("/department", conflictController.getDepartmentConflicts);
app.get("/:id", conflictController.getConflict);
app.put("/:id", conflictController.updateConflict);
app.delete("/:id", conflictController.deleteConflict);

export default app;