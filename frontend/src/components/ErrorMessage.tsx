function ErrorMessage({
  message,
  disableMargin,
}: {
  message?: string;
  disableMargin?: boolean;
}) {
  return message ? (
    <span
      className={`text-red-500 text-center text-sm contactText ${disableMargin ? "" : "mt-3"}`}
    >
      {message}
    </span>
  ) : null;
}

export default ErrorMessage;
