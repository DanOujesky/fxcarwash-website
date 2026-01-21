import { ZodError } from "zod";

export const formatZodErrors = (error: ZodError) => {
  const formattedErrors: Record<string, string> = {};
  error.issues.forEach((issue) => {
    const path = issue.path[0];
    if (path) {
      formattedErrors[path.toString()] = issue.message;
    }
  });
  return formattedErrors;
};
