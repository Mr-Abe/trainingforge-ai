type LoadingStateProps = {
  message?: string;
};

export function LoadingState({
  message = "Drafting your training plan...",
}: LoadingStateProps) {
  return (
    <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 text-sm font-medium text-emerald-900">
      {message}
    </div>
  );
}
