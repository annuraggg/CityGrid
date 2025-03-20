import { Hono } from "hono";
import notificationController from "../controllers/notificationController.js";
const app = new Hono();

app.post("/", notificationController.createNotification);
app.get("/:id", notificationController.getNotification);
app.get("/", notificationController.getNotifications);
app.get("/user", notificationController.getUserNotifications);
app.put("/:id", notificationController.markNotificationAsRead);

export default app;
