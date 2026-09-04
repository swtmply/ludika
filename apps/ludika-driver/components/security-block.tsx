import { useSecurityStore } from "@ludika/store/security";
import { useEffect } from "react";
import {
  BackHandler,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ---------------------------------------------------------------------------
// SecurityBlockScreen
// ---------------------------------------------------------------------------
// Shown when the device fails security checks in a production build.
// Deliberately un-dismissible — no back gesture, no navigation, no close button.
// On Android we offer an explicit exit; on iOS we ask the user to contact support
// (Apple forbids programmatic app exit).
// ---------------------------------------------------------------------------

export function SecurityBlockScreen() {
  const {
    isJailBroken,
    canMockLocation,
    isDevelopmentSettingsMode,
    isRealDevice,
    isDebuggedMode,
    detectedReasons,
  } = useSecurityStore();

  // Intercept the Android hardware back button so the user cannot navigate away.
  useEffect(() => {
    if (Platform.OS !== "android") return;
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => subscription.remove();
  }, []);

  const reasons =
    detectedReasons && detectedReasons.length > 0
      ? detectedReasons
      : [
          ...(isJailBroken ? ["Device is jailbroken or rooted"] : []),
          ...(canMockLocation ? ["Mock location is enabled"] : []),
          ...(isDevelopmentSettingsMode ? ["Developer options are active"] : []),
          ...(!isRealDevice ? ["Running on a simulator or emulator"] : []),
          ...(isDebuggedMode ? ["App is being debugged"] : []),
        ];

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.icon}>🛡️</Text>

      <Text style={styles.title}>Access Restricted</Text>

      <Text style={styles.subtitle}>
        This app cannot run on your device because a security check failed.
      </Text>

      {reasons.length > 0 && (
        <View style={styles.reasonsCard}>
          <Text style={styles.reasonsHeading}>Detected issues:</Text>
          {reasons.map((reason) => (
            <Text key={reason} style={styles.reasonItem}>
              • {reason}
            </Text>
          ))}
        </View>
      )}

      <Text style={styles.footer}>
        {Platform.OS === "android"
          ? "Please use an unmodified device to access this app."
          : "Please contact support if you believe this is a mistake."}
      </Text>

      {Platform.OS === "android" && (
        <TouchableOpacity
          style={styles.exitButton}
          onPress={() => BackHandler.exitApp()}
          activeOpacity={0.8}
        >
          <Text style={styles.exitButtonText}>Exit App</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  icon: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#f1f1f1",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 15,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  reasonsCard: {
    backgroundColor: "#1a1a2e",
    borderWidth: 1,
    borderColor: "#ef4444",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: "100%",
    marginBottom: 28,
  },
  reasonsHeading: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ef4444",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  reasonItem: {
    fontSize: 14,
    color: "#d1d5db",
    marginBottom: 6,
    lineHeight: 20,
  },
  footer: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 32,
  },
  exitButton: {
    backgroundColor: "#ef4444",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 40,
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  exitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
