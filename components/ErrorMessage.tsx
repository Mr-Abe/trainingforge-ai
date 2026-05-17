type ErrorMessageProps = {
  message?: string;
};

export function ErrorMessage({
  message = "Something went wrong. Please try again.",
}: ErrorMessageProps) {
  return (
    <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-6 text-sm font-medium text-rose-900">
      {message}
    </div>
  );
}
