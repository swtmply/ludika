import { env } from "@ludika/env/native";

const serverUrl = new URL(env.EXPO_PUBLIC_SERVER_URL);

export const serverBaseURL = serverUrl.toString().replace(/\/$/, "");

export const authBaseURL = new URL("/api/auth", serverUrl.origin).toString().replace(/\/$/, "");

export function getVercelProtectionHeaders(): Record<string, string> {
  const bypass = env.EXPO_PUBLIC_VERCEL_PROTECTION_BYPASS;

  if (!bypass) {
    return {};
  }

  return {
    "x-vercel-protection-bypass": bypass,
  };
}
