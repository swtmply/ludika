import JailMonkey from "jail-monkey";
import {
  isMockingLocation,
  MockLocationDetectorErrorCode,
  type MockLocationDetectorError,
} from "react-native-turbo-mock-location-detector";
import { PermissionsAndroid, Platform } from "react-native";
import { create } from "zustand";
import { env } from "@ludika/env/native";

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
  /** Mock/fake GPS locations can be injected or active. */
  canMockLocation: boolean;
  /** Android Developer Options are enabled. */
  isDevelopmentSettingsMode: boolean;
  /** Running on a real physical device (false = simulator/emulator). */
  isRealDevice: boolean;
  /** App is being actively debugged. */
  isDebuggedMode: boolean;
  /** JailMonkey trustFall heuristic passed. */
  isTrustFallPassed: boolean;
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
  canMockLocation: false,
  isDevelopmentSettingsMode: false,
  isRealDevice: true,
  isDebuggedMode: false,
  isTrustFallPassed: true,
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

      const jailMonkeyMocked = JailMonkey.canMockLocation();
      console.log("canMockLocation (JailMonkey):", jailMonkeyMocked);

      const isTurboMocked = await checkTurboMockLocation();
      console.log("canMockLocation (TurboMockLocation):", isTurboMocked);

      const canMockLocation = jailMonkeyMocked || isTurboMocked;
      console.log("canMockLocation (Combined):", canMockLocation);

      const isDevelopmentSettingsMode =
        await JailMonkey.isDevelopmentSettingsMode();

      const isDebuggedMode = await JailMonkey.isDebuggedMode();

      const isTrustFallPassed = JailMonkey.trustFall();

      const reasons: string[] = [];
      if (isJailBroken) reasons.push("Device is jailbroken or rooted");
      if (canMockLocation) reasons.push("Mock location is enabled");
      if (isDevelopmentSettingsMode)
        reasons.push("Developer options are active");
      if (isDebuggedMode) reasons.push("App is being debugged");

      console.log("isTrustFallPassed", isTrustFallPassed);
      if (isTrustFallPassed) reasons.push("Trust fall heuristic check failed");

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
        canMockLocation,
        isDevelopmentSettingsMode,
        // isRealDevice,
        isDebuggedMode,
        isTrustFallPassed,
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
