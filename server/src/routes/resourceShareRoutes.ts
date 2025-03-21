import { Hono } from "hono";
import resourceShareController from "../controllers/resourceShareController.js";
const app = new Hono();

app.post("/", resourceShareController.createResourceShare);
app.post("/department", resourceShareController.getDepartmentShareRequests);

export default app;
