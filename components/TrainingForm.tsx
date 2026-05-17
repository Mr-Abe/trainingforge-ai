import type { TrainingFormData } from "@/lib/types";

export type TrainingFormValues = {
  topic: string;
  audience: string;
  experienceLevel: "" | TrainingFormData["experienceLevel"];
  deliveryFormat: "" | TrainingFormData["deliveryFormat"];
  durationMinutes: string;
  tone: "" | TrainingFormData["tone"];
};

export type TrainingFormErrors = Partial<Record<keyof TrainingFormValues, string>>;

type TrainingFormProps = {
  errors: TrainingFormErrors;
  isLoading: boolean;
  onChange: <TField extends keyof TrainingFormValues>(
    field: TField,
    value: TrainingFormValues[TField],
  ) => void;
  onSubmit: () => void;
  values: TrainingFormValues;
};

const skillLevels: Array<{
  label: string;
  value: TrainingFormData["experienceLevel"];
}> = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
  { label: "Mixed", value: "mixed" },
];

const deliveryFormats: Array<{
  label: string;
  value: TrainingFormData["deliveryFormat"];
}> = [
  { label: "Workshop", value: "workshop" },
  { label: "Self-paced", value: "self-paced" },
  { label: "Presentation", value: "presentation" },
  { label: "Hands-on lab", value: "hands-on-lab" },
];

const tones: Array<{ label: string; value: TrainingFormData["tone"] }> = [
  { label: "Practical", value: "practical" },
  { label: "Friendly", value: "friendly" },
  { label: "Technical", value: "technical" },
  { label: "Executive", value: "executive" },
];

const inputClass =
  "mt-2 w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-100";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm font-medium text-rose-700">{message}</p>;
}

export function TrainingForm({
  errors,
  isLoading,
  onChange,
  onSubmit,
  values,
}: TrainingFormProps) {
  return (
    <form
      className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-950">
            Training brief
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            Describe the training you need. Phase 2 uses mock results only, so
            nothing is sent to a backend yet.
          </p>
        </div>
        <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-800">
          Frontend only
        </span>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-stone-800">
            Training topic
          </span>
          <input
            aria-invalid={Boolean(errors.topic)}
            className={inputClass}
            name="topic"
            onChange={(event) => onChange("topic", event.target.value)}
            placeholder="Example: Volunteer onboarding"
            type="text"
            value={values.topic}
          />
          <FieldError message={errors.topic} />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-stone-800">
            Audience
          </span>
          <input
            aria-invalid={Boolean(errors.audience)}
            className={inputClass}
            name="audience"
            onChange={(event) => onChange("audience", event.target.value)}
            placeholder="Example: New coordinators"
            type="text"
            value={values.audience}
          />
          <FieldError message={errors.audience} />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-stone-800">
            Time available
          </span>
          <input
            aria-invalid={Boolean(errors.durationMinutes)}
            className={inputClass}
            min={15}
            name="durationMinutes"
            onChange={(event) =>
              onChange("durationMinutes", event.target.value)
            }
            placeholder="60"
            type="number"
            value={values.durationMinutes}
          />
          <FieldError message={errors.durationMinutes} />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-stone-800">
            Learner skill level
          </span>
          <select
            aria-invalid={Boolean(errors.experienceLevel)}
            className={inputClass}
            name="experienceLevel"
            onChange={(event) =>
              onChange(
                "experienceLevel",
                event.target.value as TrainingFormValues["experienceLevel"],
              )
            }
            value={values.experienceLevel}
          >
            <option value="">Select skill level</option>
            {skillLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
          <FieldError message={errors.experienceLevel} />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-stone-800">
            Delivery format
          </span>
          <select
            aria-invalid={Boolean(errors.deliveryFormat)}
            className={inputClass}
            name="deliveryFormat"
            onChange={(event) =>
              onChange(
                "deliveryFormat",
                event.target.value as TrainingFormValues["deliveryFormat"],
              )
            }
            value={values.deliveryFormat}
          >
            <option value="">Select format</option>
            {deliveryFormats.map((format) => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
          <FieldError message={errors.deliveryFormat} />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-stone-800">Tone</span>
          <select
            aria-invalid={Boolean(errors.tone)}
            className={inputClass}
            name="tone"
            onChange={(event) =>
              onChange("tone", event.target.value as TrainingFormValues["tone"])
            }
            value={values.tone}
          >
            <option value="">Select tone</option>
            {tones.map((tone) => (
              <option key={tone.value} value={tone.value}>
                {tone.label}
              </option>
            ))}
          </select>
          <FieldError message={errors.tone} />
        </label>
      </div>

      <button
        className="mt-8 rounded-full bg-stone-950 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-stone-900/10 transition hover:-translate-y-0.5 hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        disabled={isLoading}
        type="submit"
      >
        {isLoading ? "Generating..." : "Generate training plan"}
      </button>
    </form>
  );
}
