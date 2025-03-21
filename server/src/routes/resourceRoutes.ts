import { Hono } from "hono";
import resourceController from "../controllers/resourceController.js";
const app = new Hono();

app.post("/", resourceController.createResource);
app.get("/", resourceController.getResources);
app.get("/my-resources", resourceController.getMyResources);
app.get("/marketplace", resourceController.getMarketplaceResources);
app.get("/:id", resourceController.getResource);
app.put("/:id", resourceController.updateResource);
app.delete("/:id", resourceController.deleteResource);

export default app;