import { Hono } from "hono";
import documentController from "../controllers/documentController.js";
const app = new Hono();

app.post("/", documentController.uploadDocument);
app.get("/:id/verify", documentController.verifyDocument);
app.get("/:id/:projectId", documentController.getDocument);
app.put("/:id", documentController.updateDocument);
app.delete("/:id", documentController.deleteDocument);

export default app;
