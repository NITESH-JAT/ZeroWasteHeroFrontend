import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View, Dimensions } from "react-native";
import { ScreenSafeArea } from "../../components/ui/ScreenSafeArea";
import { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

const { width } = Dimensions.get("window");

export function WelcomeScreen({ navigation }: Props) {
  return (
    <ScreenSafeArea edges={["top", "bottom"]} style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Soft, Solid Background Accents (No muddy transparency) */}
        <View style={styles.bgBlobGreen} />
        <View style={styles.bgBlobBlue} />

        {/* --- DYNAMIC HERO SECTION --- */}
        <View style={styles.heroSection}>
          
          {/* Main Logo Card */}
          <View style={styles.mainLogoCard}>
            <View style={styles.logoIconWrapper}>
              <MaterialCommunityIcons name="leaf" size={48} color="#00D65B" />
            </View>
          </View>

          {/* Floating Feature Card 1 (Top Left) */}
          <View style={[styles.floatingCard, styles.floatLeft]}>
            <View style={[styles.miniIconBg, { backgroundColor: "#FEF3C7" }]}>
              <MaterialCommunityIcons name="star-shooting" size={16} color="#D97706" />
            </View>
            <Text style={styles.floatingCardText}>Earn Points</Text>
          </View>

          {/* Floating Feature Card 2 (Bottom Right) */}
          <View style={[styles.floatingCard, styles.floatRight]}>
            <View style={[styles.miniIconBg, { backgroundColor: "#E0F2FE" }]}>
              <Feather name="users" size={16} color="#0284C7" />
            </View>
            <Text style={styles.floatingCardText}>Community</Text>
          </View>

        </View>

        {/* --- SOLID BOTTOM SHEET (Crisp & Readable) --- */}
        <View style={styles.bottomSheet}>
          <View style={styles.dragIndicator} />
          
          <View style={styles.badge}>
            <MaterialCommunityIcons name="shield-check" size={14} color="#00D65B" />
            <Text style={styles.badgeText}>Verified Ecosystem</Text>
          </View>

          <Text style={styles.title}>
            Zero Waste{"\n"}
            <Text style={styles.titleHighlight}>Heroes.</Text>
          </Text>
          
          <Text style={styles.subtitle}>
            Shape your city. Report waste, mobilize local drives, and earn real rewards in a gamified civic platform.
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && { transform: [{ scale: 0.98 }] }
              ]}
              onPress={() => navigation.navigate("RoleSelection")}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* Login Link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Pressable hitSlop={10} onPress={() => console.log("Navigate to Login")}>
              <Text style={styles.loginLink}>Sign In</Text>
            </Pressable>
          </View>
        </View>

      </View>
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#F8FAFC", // Very clean, light slate background
  },
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "space-between",
  },
  /* --- BACKGROUND BLOBS (Subtle & Clean) --- */
  bgBlobGreen: {
    position: "absolute",
    top: "10%",
    left: -50,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: "#00D65B",
    opacity: 0.05, // Very low opacity for a clean tint
  },
  bgBlobBlue: {
    position: "absolute",
    top: "40%",
    right: -100,
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: "#0EA5E9",
    opacity: 0.05,
  },
  /* --- HERO SECTION --- */
  heroSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  mainLogoCard: {
    width: 120,
    height: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00D65B",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 35,
    elevation: 10,
    zIndex: 2,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  logoIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#F0FDF4", // Very soft green inner background
    justifyContent: "center",
    alignItems: "center",
  },
  /* Floating Mini Cards */
  floatingCard: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
    zIndex: 1,
    borderWidth: 1,
    borderColor: "#F8FAFC",
  },
  floatLeft: {
    top: "25%",
    left: 20,
    transform: [{ rotate: "-4deg" }],
  },
  floatRight: {
    bottom: "25%",
    right: 20,
    transform: [{ rotate: "4deg" }],
  },
  miniIconBg: {
    width: 28,
    height: 28,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingCardText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  /* --- BOTTOM SHEET --- */
  bottomSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 32,
    paddingTop: 16,
    paddingBottom: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 25,
    elevation: 20,
  },
  dragIndicator: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E2E8F0",
    alignSelf: "center",
    marginBottom: 28,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#00D65B",
  },
  title: {
    fontSize: 44,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -1,
    lineHeight: 48,
    marginBottom: 16,
  },
  titleHighlight: {
    color: "#00D65B",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    lineHeight: 24,
    fontWeight: "500",
    marginBottom: 40,
  },
  /* Buttons */
  actionContainer: {
    width: "100%",
  },
  primaryButton: {
    height: 60,
    backgroundColor: "#0F172A",
    borderRadius: 20, // Modern squircle look
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 17,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  loginLink: {
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "700",
  },
});