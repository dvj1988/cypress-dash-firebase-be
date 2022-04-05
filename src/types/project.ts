// Metadata
export type MetadataType = {
  deletedAt: FirebaseFirestore.Timestamp | null;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
};

// Project Types
export type ProjectFirebaseType = {
  apiToken: string;
  projectName: string;
} & MetadataType;

export type ProjectResponseType = ProjectFirebaseType & {
  id: string;
};

export type ProjectParamsType = {
  projectId: string;
};

export type ProjectCreateType = {
  projectName: string;
};

// Test Types

export type TestFirebaseType = {
  branch: string;
  commitId: string;
} & MetadataType;

export type TestResponseType = TestFirebaseType & { id: string };

export type TestCreateType = {
  branch: string;
  commitId: string;
};

// Test Result Types

export type TestResultFirebaseType = {
  commitId: string;
  branch: string;
  result: any;
} & MetadataType;

export type TestResultResponseType = TestResultFirebaseType & { id: string };

export type TestResultParamsType = {
  projectId: string;
  testId: string;
};

export type TestResultCreateType = {
  commitId: string;
  branch: string;
  result: any;
};
