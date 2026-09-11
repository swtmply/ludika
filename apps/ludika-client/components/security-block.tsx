import { useSecurityStore } from "@ludika/store/security";
import React, { useEffect } from "react";
import {
  BackHandler,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function SecurityBlockScreen() {
  const {
    isJailBroken,
    hookDetected,
    canMockLocation,
    isTampered,
    isRealDevice,
    isDevelopmentSettingsMode,
    isDebuggedMode,
    detectedReasons,
  } = useSecurityStore();

  // Intercept the Android hardware back button so the user cannot navigate away.
  useEffect(() => {
    if (Platform.OS !== "android") return;
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => subscription.remove();
  }, []);

  const reasons =
    detectedReasons && detectedReasons.length > 0
      ? detectedReasons
      : [
          ...(isJailBroken ? ["Device is jailbroken or rooted"] : []),
          ...(hookDetected ? ["Hooking framework detected"] : []),
          ...(isTampered ? ["App tampering detected"] : []),
          ...(canMockLocation ? ["Mock location is enabled"] : []),
          ...(isDevelopmentSettingsMode ? ["Developer options active"] : []),
          ...(isDebuggedMode ? ["Debugger connected"] : []),
          ...(!isRealDevice ? ["Running on an emulator"] : []),
        ];

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9FB" />

      {/* Main Friendly Empty-State Container */}
      <View style={styles.content}>
        {/* Soft Circular Visual Icon Container */}
        <View style={styles.iconCircle}>
          <Text style={styles.iconEmoji}>🔒</Text>
        </View>

        {/* Clear & Friendly Copy */}
        <Text style={styles.title}>Unable to Open App</Text>
        <Text style={styles.subtitle}>
          To protect your personal account and payment details, we can't run
          the app on this device environment.
        </Text>

        {/* Soft Pill List for Detected Issues */}
        {reasons.length > 0 && (
          <View style={styles.reasonsContainer}>
            {reasons.map((reason) => (
              <View key={reason} style={styles.reasonPill}>
                <View style={styles.warningDot} />
                <Text style={styles.reasonText}>{reason}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Informative Footer Support Note */}
        <Text style={styles.footerNote}>
          {Platform.OS === "android"
            ? "Please restore your device to official firmware to continue."
            : "Please contact support if you believe this detection is incorrect."}
        </Text>
      </View>

      {/* Modern Fixed Bottom Action Area */}
      {Platform.OS === "android" && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.exitButton}
            onPress={() => BackHandler.exitApp()}
            activeOpacity={0.85}
          >
            <Text style={styles.exitButtonText}>Close App</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

// Delivery-Style Color Palette
const COLORS = {
  background: "#F9F9FB",
  surface: "#FFFFFF",
  textPrimary: "#1A1D1E",
  textSecondary: "#6C727F",
  warningDot: "#F59E0B",
  border: "#EEF0F2",
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    // Soft drop shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  iconEmoji: {
    fontSize: 36,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 28,
  },
  reasonsContainer: {
    width: "100%",
    gap: 8,
    marginBottom: 24,
  },
  reasonPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  warningDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.warningDot,
    marginRight: 12,
  },
  reasonText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textPrimary,
    flex: 1,
  },
  footerNote: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 12,
  },
  exitButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.textPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  exitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});