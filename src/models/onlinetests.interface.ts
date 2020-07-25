export interface OnlineTest {
  id: number;	
  name: string;
  description: string;
  testStatus: string;
  environment: string;
  published: boolean;
  author: string;
  created: string;
  updated: string;
  duration: number;
  durationMins: number;
  durationHours: number;
  envId: number;
  instanceId: string;
  enableWebCamRecording:boolean;
  isWebBasedTest:boolean;
  GitHubUrl: string;
  videoInterviewQuestions: string[];
  mcqQuestions: string;
  taskId: string;
  containerName: string;
  testType: string;
  projectName: string;
  problemDefination:string
  isBasic: boolean;
}