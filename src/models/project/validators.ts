import { ProjectCreateType } from "@/types/project";

export const isCreateProjectPayloadValid = (newProject: ProjectCreateType) => {
  if (!newProject.projectName) {
    return false;
  }

  return true;
};
