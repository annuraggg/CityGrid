import { Hono } from "hono";
import inviteController from "../controllers/inviteController.js";
const app = new Hono();

app.post("/project-manager", inviteController.inviteProjectManager);
app.post("/hod", inviteController.inviteHod);
app.get("/onboard-user", inviteController.onboardUser);

export default app;
