import express from "express";
import { addProject } from "../controllers/Project.controller.js";
import { verifyToken } from "../utils/index.js";

const app = express();

app.post('/add-project',verifyToken,addProject);

export default app;