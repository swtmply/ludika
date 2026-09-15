/**
 * Result of an auth submit handler.
 *
 * Returning `{ error }` renders a danger toast; returning nothing (or `void`)
 * counts as success. Throwing is also treated as failure, so callers can use
 * whichever error style their auth client prefers.
 */
export type AuthSubmitResult = { error?: string | null } | void;

export type SignInValues = {
  email: string;
  password: string;
};

export type SignUpValues = {
  name: string;
  email: string;
  password: string;
};
