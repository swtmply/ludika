import { expo } from "@better-auth/expo";
import { createDb } from "@ludika/db";
import * as schema from "@ludika/db/schema/auth";
import { env } from "@ludika/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export function createAuth() {
  const db = createDb();

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",

      schema: schema,
    }),
    trustedOrigins: [
      env.CORS_ORIGIN,
      "ludika-client://",
      "ludika-driver://",
      "exp://",
      "http://localhost:8081",
    ],
    emailAndPassword: {
      enabled: true,
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    advanced: {
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      },
    },
    plugins: [expo()],
  });
}

export const auth = createAuth();
