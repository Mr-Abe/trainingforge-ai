import type { TrainingResult } from "./types";

export function normalizeMarkdown(markdown: string): string {
  return markdown.trim();
}

function bulletList(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

function numberedList(items: string[]): string {
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

export function trainingResultToMarkdown(result: TrainingResult): string {
  const sections = [
    `# ${result.title}`,
    result.summary,
    "## Learning Objectives",
    bulletList(
      result.learningObjectives.map((objective) => objective.description),
    ),
    "## Agenda",
    result.agenda
      .map(
        (item) =>
          `### ${item.title} (${item.durationMinutes} min)\n${item.description}`,
      )
      .join("\n\n"),
    `## ${result.mainLesson.title}`,
    result.mainLesson.sections.join("\n\n"),
    `## ${result.scenarioActivity.title}`,
    `### Setup\n${result.scenarioActivity.setup}`,
    `### Instructions\n${numberedList(result.scenarioActivity.instructions)}`,
    `### Debrief Questions\n${bulletList(
      result.scenarioActivity.debriefQuestions,
    )}`,
    "## Knowledge-Check Questions",
    result.knowledgeCheck
      .map((question, index) => {
        const explanation = question.explanation
          ? `\n\nExplanation: ${question.explanation}`
          : "";

        return [
          `### ${index + 1}. ${question.question}`,
          bulletList(question.options),
          `Correct answer: ${question.correctAnswer}${explanation}`,
        ].join("\n\n");
      })
      .join("\n\n"),
    "## Facilitator Notes",
    bulletList(result.facilitatorNotes),
  ];

  return normalizeMarkdown(sections.filter(Boolean).join("\n\n"));
}
