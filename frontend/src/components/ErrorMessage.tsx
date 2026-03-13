function ErrorMessage({ message }: { message?: string }) {
  return message ? (
    <span className={`text-red-500 text-center text-sm contactText mt-3`}>
      {message}
    </span>
  ) : null;
}

export default ErrorMessage;
