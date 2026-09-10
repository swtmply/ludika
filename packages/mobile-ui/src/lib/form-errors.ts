/**
 * Pull the first human-readable message out of a TanStack Form error map entry.
 *
 * Form errors arrive as a string, an array of Zod issues, or an object with a
 * `message` field depending on where validation failed, so every auth form
 * needs the same normalisation before it can render one line of text.
 */
export function getErrorMessage(error: unknown): string | null {
  if (!error) return null;

  if (typeof error === "string") {
    return error;
  }

  if (Array.isArray(error)) {
    for (const issue of error) {
      const message = getErrorMessage(issue);
      if (message) {
        return message;
      }
    }
    return null;
  }

  if (typeof error === "object" && error !== null) {
    const maybeError = error as { message?: unknown };
    if (typeof maybeError.message === "string") {
      return maybeError.message;
    }
  }

  return null;
}
