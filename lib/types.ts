export type TrainingFormData = {
  topic: string;
  audience: string;
  trainingGoal: string;
  durationMinutes: number;
  deliveryFormat: "workshop" | "self-paced" | "presentation" | "hands-on-lab";
  experienceLevel: "beginner" | "intermediate" | "advanced" | "mixed";
  tone: "practical" | "friendly" | "technical" | "executive";
  constraints?: string;
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

export type TrainingResult = {
  title: string;
  summary: string;
  learningObjectives: LearningObjective[];
  agenda: AgendaItem[];
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
