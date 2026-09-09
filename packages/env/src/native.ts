import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "EXPO_PUBLIC_",
  client: {
    EXPO_PUBLIC_SERVER_URL: z.url(),
    EXPO_PUBLIC_VERCEL_PROTECTION_BYPASS: z.string().min(1).optional(),
  },
  runtimeEnv: {
    EXPO_PUBLIC_SERVER_URL: process.env.EXPO_PUBLIC_SERVER_URL,
    EXPO_PUBLIC_VERCEL_PROTECTION_BYPASS: process.env.EXPO_PUBLIC_VERCEL_PROTECTION_BYPASS,
  },
  emptyStringAsUndefined: true,
});
