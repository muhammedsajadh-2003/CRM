import express from "express";
import { signIn, signUp } from "../controllers/auth.controller.js";

const app = express();

app.post('/sign-up', signUp);
app.post('/sign-in', signIn);

export default app;