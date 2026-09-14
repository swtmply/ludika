import type { AppRouter } from "@ludika/api/routers/index";
import { useSecurityStore } from "@ludika/store/security";
import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { Platform } from "react-native";

import { authClient } from "@/lib/auth-client";
import {
  getVercelProtectionHeaders,
  serverBaseURL,
} from "@/lib/server-config";

export const queryClient = new QueryClient();

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${serverBaseURL}/trpc`,
      fetch(url, options) {
        // Security guard: reject all outgoing requests if the device is
        // compromised.
        if (useSecurityStore.getState().isCompromised) {
          return Promise.reject(
            new Error("[Security] Request blocked — device failed security checks."),
          );
        }

        return fetch(url, {
          ...options,
          credentials: Platform.OS === "web" ? "include" : "omit",
        });
      },
      async headers() {
        const headers: Record<string, string | undefined> = {
          ...getVercelProtectionHeaders(),
        };

        if (Platform.OS !== "web") {
          const cookies = await authClient.getCookie();
          if (cookies) {
            headers.Cookie = cookies;
          }
        }

        return headers;
      },
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
