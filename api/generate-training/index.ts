type FunctionContext = {
  res?: {
    status: number;
    body: unknown;
  };
};

export default async function generateTraining(
  context: FunctionContext,
): Promise<void> {
  context.res = {
    status: 501,
    body: {
      error: "Training generation is not implemented yet.",
    },
  };
}
