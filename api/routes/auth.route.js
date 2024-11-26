import express from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controller.js";

const app = express();

app.post('/sign-up', signUp);
app.post('/sign-in', signIn);
app.get('/sign-out', signOut);

export default app;