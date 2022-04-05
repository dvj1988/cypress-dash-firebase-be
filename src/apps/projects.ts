import express from "express";
import cors from "cors";
import {
  createProject,
  getProject,
  getProjects,
  getTestResultOfTest,
  getTestsOfProject,
  addTestResults,
} from "@/models/project/resolvers";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { responseLocals } from "@/repositories";

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use((req, res, next) => {
  res.locals = responseLocals;
  next();
});

// Add test result of a Test run
app.post("/testResult", addTestResults);

app.use(authMiddleware);

// Get Project details
app.get("/:projectId", getProject);

// Get all Projects
app.get("/", getProjects);

// Create Project
app.post("/", createProject);

// Get Test runs of a Project
app.get("/:projectId/tests", getTestsOfProject);

// Get test result of a Test run
app.get("/:projectId/tests/:testId", getTestResultOfTest);

// Expose Express API as a single Cloud Function:
export default app;
