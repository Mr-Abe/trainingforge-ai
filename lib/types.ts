export type TrainingFormData = {
  topic: string;
  audience: string;
  durationMinutes: number;
  deliveryFormat: "workshop" | "self-paced" | "presentation" | "hands-on-lab";
  experienceLevel: "beginner" | "intermediate" | "advanced" | "mixed";
  tone: "practical" | "friendly" | "technical" | "executive";
};

export type LearningObjective = {
  id: string;
  description: string;
};

export type AgendaItem = {
  id: string;
  title: string;
  durationMinutes: number;
  description: string;
};

export type KnowledgeCheckQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
};

export type MainLesson = {
  title: string;
  sections: string[];
};

export type ScenarioActivity = {
  title: string;
  setup: string;
  instructions: string[];
  debriefQuestions: string[];
};

export type TrainingResult = {
  title: string;
  summary: string;
  learningObjectives: LearningObjective[];
  agenda: AgendaItem[];
  mainLesson: MainLesson;
  scenarioActivity: ScenarioActivity;
  facilitatorNotes: string[];
  knowledgeCheck: KnowledgeCheckQuestion[];
  markdownDraft: string;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: string[];
  };
};

export type ApiSuccessResponse<TData = TrainingResult> = {
  success: true;
  data: TData;
  message?: string;
};
