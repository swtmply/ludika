import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

import { authBaseURL, getVercelProtectionHeaders } from "@/lib/server-config";

export const authClient = createAuthClient({
  baseURL: authBaseURL,
  fetchOptions: {
    headers: getVercelProtectionHeaders(),
  },
  plugins: [
    expoClient({
      scheme: Constants.expoConfig?.scheme as string,
      storagePrefix: Constants.expoConfig?.scheme as string,
      storage: SecureStore,
    }),
  ],
});
