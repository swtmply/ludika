import type { AppRouter } from "@ludika/api/routers/index";
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
        return fetch(url, {
          ...options,
          credentials: Platform.OS === "web" ? "include" : "omit",
        });
      },
      async headers() {
        const headers: Record<string, string> = {
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
