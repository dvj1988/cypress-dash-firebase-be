import {
  BAD_REQUEST_STATUS_CODE,
  MSG_INVALID_CREATE_PROJECT_PAYLOAD,
  MSG_INVALID_PAGINATION_PARAMS,
  NOT_FOUND_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
} from "@/constants/response";
import { PaginationQueryType } from "@/types/common";
import { ExpressRequest, ExpressResponse } from "@/types/express";
import {
  ProjectCreateType,
  ProjectParamsType,
  TestResultCreateType,
  TestResultParamsType,
} from "@/types/project";
import {
  getParsedPaginationParams,
  isPaginationObjectValid,
} from "@/utils/pagination";
import { getErrorResponse, getSuccessResponse } from "@/utils/response";
import { pick } from "lodash";
import { isCreateProjectPayloadValid } from "./validators";

export const getProject = async (
  req: ExpressRequest<ProjectParamsType>,
  res: ExpressResponse
) => {
  const { projectRepository } = res.locals;

  const {
    params: { projectId },
  } = req;

  if (!projectId) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .json(getErrorResponse(BAD_REQUEST_STATUS_CODE));
  }

  try {
    const project = await projectRepository.getById(projectId);
    return res.json(getSuccessResponse({ project }));
  } catch (err) {
    return res
      .status(NOT_FOUND_STATUS_CODE)
      .json(getErrorResponse(NOT_FOUND_STATUS_CODE));
  }
};

export const getProjects = async (
  req: ExpressRequest<{}, {}, {}, PaginationQueryType>,
  res: ExpressResponse
) => {
  const { projectRepository } = res.locals;
  const { pageNumber, pageSize } = getParsedPaginationParams(req.query);

  if (
    !isPaginationObjectValid({ pageNumber, pageSize }) ||
    !pageNumber ||
    !pageSize
  ) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .json(
        getErrorResponse(BAD_REQUEST_STATUS_CODE, MSG_INVALID_PAGINATION_PARAMS)
      );
  }
  console.log({ pageNumber, pageSize });

  try {
    const projects = await projectRepository.list({
      pageNumber,
      pageSize,
    });

    const { totalCount } = await projectRepository.getTotalCount();

    return res.json(
      getSuccessResponse({
        projects,
        pageInfo: {
          pageNumber,
          pageSize,
          totalCount,
        },
      })
    );
  } catch (err) {
    console.log("Hello");
    console.log(err);
    return res
      .status(SERVER_ERROR_STATUS_CODE)
      .json(getErrorResponse(SERVER_ERROR_STATUS_CODE));
  }
};

export const createProject = async (
  req: ExpressRequest<{}, {}, ProjectCreateType>,
  res: ExpressResponse
) => {
  const { projectRepository } = res.locals;

  const { body } = req;

  const newProject = pick(body, ["projectName"]);

  if (!isCreateProjectPayloadValid(newProject)) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .json(
        getErrorResponse(
          BAD_REQUEST_STATUS_CODE,
          MSG_INVALID_CREATE_PROJECT_PAYLOAD
        )
      );
  }

  try {
    const project = await projectRepository.create(newProject);
    return res.json(getSuccessResponse({ project }));
  } catch (err) {
    return res
      .status(SERVER_ERROR_STATUS_CODE)
      .json(getErrorResponse(SERVER_ERROR_STATUS_CODE));
  }
};

export const getTestsOfProject = async (
  req: ExpressRequest<ProjectParamsType, {}, {}, PaginationQueryType>,
  res: ExpressResponse
) => {
  const { projectRepository } = res.locals;
  const { projectId } = req.params;
  const { pageNumber, pageSize } = getParsedPaginationParams(req.query);

  if (!isPaginationObjectValid({ pageNumber, pageSize }) || !projectId) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .json(getErrorResponse(BAD_REQUEST_STATUS_CODE));
  }

  let project;

  try {
    project = await projectRepository.getById(projectId);
  } catch (err) {
    return res
      .status(NOT_FOUND_STATUS_CODE)
      .json(getErrorResponse(NOT_FOUND_STATUS_CODE));
  }

  if (!project) {
    return res
      .status(NOT_FOUND_STATUS_CODE)
      .json(getErrorResponse(NOT_FOUND_STATUS_CODE));
  }

  try {
    const tests = await projectRepository.getTestsOfProject(projectId, {
      pageNumber,
      pageSize,
    });

    const { totalCount } = await projectRepository.getTestsTotalCount(
      projectId
    );

    return res.json(
      getSuccessResponse({
        project,
        tests,
        pageInfo: {
          pageNumber,
          pageSize,
          totalCount,
        },
      })
    );
  } catch (err) {
    return res
      .status(SERVER_ERROR_STATUS_CODE)
      .json(getErrorResponse(SERVER_ERROR_STATUS_CODE));
  }
};

export const getTestResultOfTest = async (
  req: ExpressRequest<TestResultParamsType, {}, {}, PaginationQueryType>,
  res: ExpressResponse
) => {
  const { projectRepository } = res.locals;
  const { projectId, testId } = req.params;

  if (!testId || !projectId) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .json(getErrorResponse(BAD_REQUEST_STATUS_CODE));
  }

  let project;

  try {
    project = await projectRepository.getById(projectId);
  } catch (err) {
    return res
      .status(NOT_FOUND_STATUS_CODE)
      .json(getErrorResponse(NOT_FOUND_STATUS_CODE));
  }

  if (!project) {
    return res
      .status(NOT_FOUND_STATUS_CODE)
      .json(getErrorResponse(NOT_FOUND_STATUS_CODE));
  }

  let test;

  try {
    test = await projectRepository.getTestOfProjectById(projectId, testId);
  } catch (err) {
    return res
      .status(NOT_FOUND_STATUS_CODE)
      .json(getErrorResponse(NOT_FOUND_STATUS_CODE));
  }

  if (!test) {
    return res
      .status(NOT_FOUND_STATUS_CODE)
      .json(getErrorResponse(NOT_FOUND_STATUS_CODE));
  }

  try {
    const testResult = await projectRepository.getTestResultsOfTest(
      projectId,
      testId
    );

    return res.json(
      getSuccessResponse({
        project,
        test,
        testResult,
      })
    );
  } catch (err) {
    return res
      .status(SERVER_ERROR_STATUS_CODE)
      .json(getErrorResponse(SERVER_ERROR_STATUS_CODE));
  }
};

export const addTestResults = async (
  req: ExpressRequest<{}, {}, TestResultCreateType, {}>,
  res: ExpressResponse
) => {
  // Get API Key from Request
  const apiToken = req.headers["api-token"] as string;
  const { projectRepository } = res.locals;

  if (!apiToken) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .json(getErrorResponse(BAD_REQUEST_STATUS_CODE));
  }

  let project;
  // Get project details
  try {
    project = await projectRepository.getByApiToken(apiToken);
  } catch (err) {
    return res
      .status(NOT_FOUND_STATUS_CODE)
      .json(getErrorResponse(NOT_FOUND_STATUS_CODE));
  }

  if (!project) {
    return res
      .status(NOT_FOUND_STATUS_CODE)
      .json(getErrorResponse(NOT_FOUND_STATUS_CODE));
  }

  // Get commit id, branch name from request body
  const { branch, commitId, result } = req.body;

  if (!branch || !commitId || !result) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .json(getErrorResponse(BAD_REQUEST_STATUS_CODE));
  }

  let test;

  // Create Test in project
  try {
    test = await projectRepository.createTestOfProject(project.id, {
      branch,
      commitId,
    });
  } catch (err) {
    return res
      .status(SERVER_ERROR_STATUS_CODE)
      .json(getErrorResponse(SERVER_ERROR_STATUS_CODE));
  }

  // Create test result
  try {
    const testResult = await projectRepository.createTestResult({
      branch,
      commitId,
      result,
    });
    return res.json(
      getSuccessResponse({
        test,
        testResult,
      })
    );
  } catch (err) {
    return res
      .status(SERVER_ERROR_STATUS_CODE)
      .json(getErrorResponse(SERVER_ERROR_STATUS_CODE));
  }
};
