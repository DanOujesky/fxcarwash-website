function ErrorMessage({
  message,
  marginOn,
}: {
  message?: string;
  marginOn?: boolean;
}) {
  return message ? (
    <span
      className={`text-red-500 text-center text-sm contactText ${marginOn ? "mt-3" : ""}`}
    >
      {message}
    </span>
  ) : null;
}

export default ErrorMessage;
