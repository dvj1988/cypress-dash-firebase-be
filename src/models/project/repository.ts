import { firestore } from "firebase-admin";
import {
  ProjectCreateType,
  ProjectResponseType,
  TestCreateType,
  TestResponseType,
  TestResultCreateType,
  TestResultResponseType,
} from "@/types/project";
import {
  PROJECTS_COLLECTION_NAME,
  DOC_NOT_FOUND,
  TESTS_COLLECTION_NAME,
  TEST_REPORT_COLLECTION_NAME,
} from "@/constants/firestore";
import { PaginationType, PaginationTypeOrNull } from "@/types/common";
import { v4 as uuidv4 } from "uuid";

export class ProjectRepository {
  db: firestore.Firestore;

  constructor() {
    this.db = firestore();
  }

  async getById(id: string) {
    return this.db
      .collection(PROJECTS_COLLECTION_NAME)
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return {
            id: doc.id,
            ...doc.data(),
          } as ProjectResponseType;
        }

        throw new Error(DOC_NOT_FOUND);
      });
  }

  async getByApiToken(apiToken: string) {
    return this.db
      .collection(PROJECTS_COLLECTION_NAME)
      .where("apiToken", "==", apiToken)
      .limit(1)
      .get()
      .then((snapshots) => {
        if (snapshots.docs.length) {
          const projectSnapshot = snapshots.docs[0];
          return {
            id: projectSnapshot.id,
            ...projectSnapshot.data(),
          } as ProjectResponseType;
        }

        throw new Error(DOC_NOT_FOUND);
      });
  }

  list({ pageNumber, pageSize }: PaginationType) {
    const query = this.db
      .collection(PROJECTS_COLLECTION_NAME)
      .orderBy("createdAt", "desc")
      .where("deletedAt", "==", null)
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize);

    return query
      .get()
      .then((snapshot) =>
        snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as ProjectResponseType)
        )
      );
  }

  getTotalCount() {
    return this.db
      .collection(PROJECTS_COLLECTION_NAME)
      .where("deletedAt", "==", null)
      .get()
      .then((doc) => {
        return {
          totalCount: doc.docs.length,
        };
      });
  }

  create(projectObj: ProjectCreateType) {
    const createdAt = firestore.Timestamp.now();
    const newProject = {
      ...projectObj,
      apiToken: uuidv4(),
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    };

    return this.db
      .collection(PROJECTS_COLLECTION_NAME)
      .add(newProject)
      .then(
        (d) =>
          ({
            id: d.id,
            ...newProject,
          } as ProjectResponseType)
      );
  }

  createTestOfProject(projectId: string, testObj: TestCreateType) {
    const createdAt = firestore.Timestamp.now();
    const newTest = {
      ...testObj,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    };
    return this.db
      .collection(PROJECTS_COLLECTION_NAME)
      .doc(projectId)
      .collection(TESTS_COLLECTION_NAME)
      .doc(newTest.commitId)
      .set(newTest)
      .then(
        (d) =>
          ({
            id: newTest.commitId,
            ...newTest,
          } as TestResponseType)
      );
  }

  getTestOfProjectById(projectId: string, testId: string) {
    return this.db
      .collection(PROJECTS_COLLECTION_NAME)
      .doc(projectId)
      .collection(TESTS_COLLECTION_NAME)
      .doc(testId)
      .get()
      .then((snapshot) => {
        return { id: snapshot.id, ...snapshot.data() } as TestResponseType;
      });
  }

  getTestsOfProject(
    projectId: string,
    { pageNumber, pageSize }: PaginationTypeOrNull
  ) {
    const query = this.db
      .collection(PROJECTS_COLLECTION_NAME)
      .doc(projectId)
      .collection(TESTS_COLLECTION_NAME)
      .orderBy("createdAt", "desc")
      .where("deletedAt", "==", null);

    if (pageNumber && pageSize) {
      query.limit(pageSize).offset((pageNumber - 1) * pageSize);
    }

    return query
      .get()
      .then((snapshot) =>
        snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as TestResponseType)
        )
      );
  }

  getTestsTotalCount(projectId: string) {
    return this.db
      .collection(PROJECTS_COLLECTION_NAME)
      .doc(projectId)
      .collection(TESTS_COLLECTION_NAME)
      .where("deletedAt", "==", null)
      .get()
      .then((doc) => {
        return {
          totalCount: doc.docs.length,
        };
      });
  }

  getTestResultsOfTest(projectId: string, testId: string) {
    return this.db
      .collection(TEST_REPORT_COLLECTION_NAME)
      .where("projectId", "==", projectId)
      .where("testId", "==", testId)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get()
      .then((doc) => {
        if (doc.docs.length) {
          const testResultSnapshot = doc.docs[0];
          return {
            id: testResultSnapshot.id,
            ...testResultSnapshot.data(),
          } as TestResultResponseType;
        }

        throw new Error(DOC_NOT_FOUND);
      });
  }

  createTestResult(testResultObj: TestResultCreateType) {
    const createdAt = firestore.Timestamp.now();
    const newTestResult = {
      ...testResultObj,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    };
    return this.db
      .collection(TEST_REPORT_COLLECTION_NAME)
      .add(newTestResult)
      .then((snapshot) => {
        return {
          id: snapshot.id,
          ...newTestResult,
        } as TestResultResponseType;
      });
  }
}
