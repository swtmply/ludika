import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const serverUrlSchema = z.union([
  z.url(),
  z.string().regex(/^\/(?!\/)/, "Use an absolute URL or a same-origin path like /api"),
]);

export const env = createEnv({
  client: {
    NEXT_PUBLIC_SERVER_URL: serverUrlSchema,
  },
  runtimeEnv: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
  },
  emptyStringAsUndefined: true,
});
