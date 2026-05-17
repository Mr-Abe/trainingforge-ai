import type { TrainingFormData, TrainingResult } from "./types";

export async function generateTraining(
  request: TrainingFormData,
): Promise<TrainingResult> {
  void request;
  throw new Error("Training generation is not implemented yet.");
}
