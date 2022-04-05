import { initializeApp } from "firebase-admin";
import { ProjectRepository } from "@/models/project/repository";

initializeApp();

export const projectRepository = new ProjectRepository();

export const responseLocals = {
  projectRepository,
};
