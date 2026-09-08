import JailMonkey from "jail-monkey";
import DeviceInfo from "react-native-device-info";
import {
  isMockingLocation,
  MockLocationDetectorErrorCode,
  type MockLocationDetectorError,
} from "react-native-turbo-mock-location-detector";
import { PermissionsAndroid, Platform } from "react-native";
import { create } from "zustand";
import { env } from "@ludika/env/native";

const TRUSTED_INSTALLERS_ANDROID = [
  "com.android.vending", // Google Play Store
  "com.google.android.feedback", // Google Play review / internal testing
  "com.sec.android.app.samsungapps", // Samsung Galaxy Store
];

const TRUSTED_INSTALLERS_IOS = [
  "AppStore",
  "TestFlight",
  "com.apple.TestFlight",
];

const EXPECTED_BUNDLE_IDS = [
  "com.knights.ludika.client",
  "com.knights.ludika.driver",
];

/**
 * Handles location permissions and uses react-native-turbo-mock-location-detector
 * (TurboModule compatible with New Architecture) to detect mock locations.
 */
async function checkTurboMockLocation(): Promise<boolean> {
  try {
    if (Platform.OS === "android") {
      let hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (!hasPermission) {
        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message:
              "Location permission is needed to verify device integrity.",
            buttonPositive: "OK",
          },
        );
        hasPermission = status === PermissionsAndroid.RESULTS.GRANTED;
      }

      if (!hasPermission) {
        console.warn(
          "[Security] Location permission not granted, cannot verify mock location",
        );
        return false;
      }
    }

    const { isLocationMocked } = await isMockingLocation();
    console.log("isLocationMocked (TurboMockLocation):", isLocationMocked);
    return Boolean(isLocationMocked);
  } catch (error: any) {
    const err = error as MockLocationDetectorError;

    switch (err?.code) {
      case MockLocationDetectorErrorCode.GPSNotEnabled:
        console.warn(
          "[Security] TurboMockLocation: GPS is not enabled on device",
        );
        break;
      case MockLocationDetectorErrorCode.NoLocationPermissionEnabled:
        console.warn(
          "[Security] TurboMockLocation: No location permission enabled",
        );
        break;
      case MockLocationDetectorErrorCode.CantDetermine:
        console.warn(
          "[Security] TurboMockLocation: Cannot determine mock location status",
        );
        break;
      default:
        console.warn(
          "[Security] TurboMockLocation error:",
          err?.message || error,
        );
        break;
    }

    return false;
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SecurityState {
  /** Device is jailbroken (iOS) or rooted (Android). */
  isJailBroken: boolean;
  /** Hooking or reverse-engineering framework detected (Substrate, Xposed, Frida, etc.). */
  hookDetected: boolean;
  /** Mock/fake GPS locations can be injected or active. */
  canMockLocation: boolean;
  /** App package tampering or unofficial sideloading detected. */
  isTampered: boolean;
  /** Name of the package installer that installed the app. */
  installerPackageName: string | null;
  /** Android Developer Options are enabled. */
  isDevelopmentSettingsMode: boolean;
  /** Running on a real physical device (false = simulator/emulator). */
  isRealDevice: boolean;
  /** App is being actively debugged. */
  isDebuggedMode: boolean;
  /** List of human-readable reasons why the device was flagged. */
  detectedReasons: string[];
  /**
   * Aggregate flag — true when an active threat is detected AND security enforcement is enabled.
   */
  isCompromised: boolean;
  /** Whether security enforcement is active. */
  isEnforced: boolean;
  /** true once checkDeviceSecurity() has finished its first run. */
  isChecked: boolean;
}

export interface SecurityActions {
  checkDeviceSecurity: () => Promise<void>;
  /** Force-reset all flags. */
  reset: () => void;
}

export type SecurityStore = SecurityState & SecurityActions;

const initialState: SecurityState = {
  isJailBroken: false,
  hookDetected: false,
  canMockLocation: false,
  isTampered: false,
  installerPackageName: null,
  isDevelopmentSettingsMode: false,
  isRealDevice: true,
  isDebuggedMode: false,
  detectedReasons: [],
  isCompromised: false,
  isEnforced: false,
  isChecked: false,
};

export const useSecurityStore = create<SecurityStore>((set) => ({
  ...initialState,

  checkDeviceSecurity: async () => {
    try {
      const envSetting = env.EXPO_PUBLIC_ENABLE_SECURITY_CHECKS;
      console.log("envSetting", envSetting);
      const isEnforced =
        envSetting !== undefined && envSetting !== ""
          ? envSetting === "true" || envSetting === "1"
          : true;

      const isJailBroken = JailMonkey.isJailBroken();
      console.log("isJailBroken", isJailBroken);

      const hookDetected =
        typeof JailMonkey.hookDetected === "function"
          ? JailMonkey.hookDetected()
          : false;
      console.log("hookDetected", hookDetected);

      const jailMonkeyMocked = JailMonkey.canMockLocation();
      console.log("canMockLocation (JailMonkey):", jailMonkeyMocked);

      const isTurboMocked = await checkTurboMockLocation();
      console.log("canMockLocation (TurboMockLocation):", isTurboMocked);

      const canMockLocation = jailMonkeyMocked || isTurboMocked;
      console.log("canMockLocation (Combined):", canMockLocation);

      const isDevelopmentSettingsMode =
        await JailMonkey.isDevelopmentSettingsMode();

      const isDebuggedMode = await JailMonkey.isDebuggedMode();

      let installerPackageName: string | null = null;
      let isRealDevice = true;
      let bundleId = "";

      try {
        if (Platform.OS !== "web") {
          installerPackageName =
            (await DeviceInfo.getInstallerPackageName()) || null;
          const isEmulator = await DeviceInfo.isEmulator();
          isRealDevice = !isEmulator;
          bundleId = DeviceInfo.getBundleId();
        }
      } catch (err) {
        console.warn("[Security] Failed to query DeviceInfo:", err);
      }
      console.log("installerPackageName:", installerPackageName);
      console.log("isRealDevice:", isRealDevice);
      console.log("bundleId:", bundleId);

      const reasons: string[] = [];
      if (isJailBroken) reasons.push("Device is jailbroken or rooted");
      if (hookDetected)
        reasons.push("Hooking or reverse-engineering framework detected");
      if (canMockLocation) reasons.push("Mock location is enabled");
      if (isDevelopmentSettingsMode)
        reasons.push("Developer options are active");
      if (isDebuggedMode) reasons.push("App is being debugged");
      if (!isRealDevice) reasons.push("Running on an emulator/simulator");

      let isTampered = false;

      // 1. Bundle ID / Package Name integrity check
      // Repackaged or cloned apps usually alter the bundle identifier.
      if (bundleId) {
        const isRecognizedBundle =
          __DEV__ ||
          EXPECTED_BUNDLE_IDS.includes(bundleId) ||
          bundleId.startsWith("com.knights.ludika");

        if (!isRecognizedBundle) {
          isTampered = true;
          reasons.push(
            `App package identifier modified or cloned (${bundleId})`,
          );
        }
      }

      const allowUnofficial = Boolean(
        env.EXPO_PUBLIC_ALLOW_UNOFFICIAL_INSTALLER === "true" ||
        env.EXPO_PUBLIC_ALLOW_UNOFFICIAL_INSTALLER === "1",
      );

      if (isEnforced && !allowUnofficial) {
        const isTrustedInstaller =
          Platform.OS === "android"
            ? installerPackageName !== null &&
              TRUSTED_INSTALLERS_ANDROID.includes(installerPackageName)
            : Platform.OS === "ios"
              ? installerPackageName !== null &&
                TRUSTED_INSTALLERS_IOS.includes(installerPackageName)
              : true;

        if (!isTrustedInstaller) {
          isTampered = true;
          reasons.push(
            `Untrusted app installer source: ${installerPackageName || "sideloaded / unknown"}`,
          );
        }
      }

      const hasThreats = reasons.length > 0;
      const isCompromised = isEnforced && hasThreats;

      if (!isEnforced && hasThreats) {
        console.warn(
          "[Security] ⚠️  Threats detected (bypassed in dev — set EXPO_PUBLIC_ENABLE_SECURITY_CHECKS=true to enforce):",
          reasons,
        );
      } else if (isCompromised) {
        console.warn(
          "[Security] 🚨 Device compromised — access restricted:",
          reasons,
        );
      }

      set({
        isJailBroken,
        hookDetected,
        canMockLocation,
        isTampered,
        installerPackageName,
        isDevelopmentSettingsMode,
        isRealDevice,
        isDebuggedMode,
        detectedReasons: reasons,
        isEnforced,
        isCompromised,
        isChecked: true,
      });
    } catch (error) {
      console.error("[Security] checkDeviceSecurity() threw:", error);
      const isEnforced = env.EXPO_PUBLIC_ENABLE_SECURITY_CHECKS === "1";

      set({
        isChecked: true,
        isEnforced,
        isCompromised: isEnforced,
        detectedReasons: isEnforced ? ["Security verification error"] : [],
      });
    }
  },

  reset: () => set(initialState),
}));
