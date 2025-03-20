import { Hono } from "hono";
import userController from "../controllers/userController.js";
const app = new Hono();

app.post("/create", userController.userCreated);
app.post("/delete", userController.userDeleted);
app.post("/update", userController.userUpdated);
app.get("/team/:dept", userController.getTeam);

export default app;
