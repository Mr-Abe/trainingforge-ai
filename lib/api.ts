import type { TrainingRequest, TrainingResult } from "./types";

export async function generateTraining(
  request: TrainingRequest,
): Promise<TrainingResult> {
  void request;
  throw new Error("Training generation is not implemented yet.");
}
