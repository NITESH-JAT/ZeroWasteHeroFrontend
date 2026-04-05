import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import { ScreenSafeArea } from "../../components/ui/ScreenSafeArea";
import { AppRole, appRoles } from "../../constants/roles";
import { RootStackParamList } from "../../navigation/types";
import { useAppStore } from "../../store/useAppStore";

type Props = NativeStackScreenProps<RootStackParamList, "RoleSelection">;

const { width } = Dimensions.get("window");

type RoleConfig = {
  title: string;
  headline: string;
  description: string;
  detail: string;
  status: string;
  icon:
    | keyof typeof MaterialCommunityIcons.glyphMap
    | keyof typeof FontAwesome6.glyphMap;
  iconFamily: "material" | "fontawesome";
  accent: string;
  accentSoft: string;
};

const roleConfig: Record<AppRole, RoleConfig> = {
  citizen: {
    title: "Citizen",
    headline: "Community reporter",
    description: "Report waste & earn rewards.",
    detail:
      "Best for people who want to spot issues quickly, contribute proof, and track local impact.",
    status: "Ready to report",
    icon: "street-view",
    iconFamily: "fontawesome",
    accent: "#00D65B",
    accentSoft: "#F0FDF4",
  },
  ngo: {
    title: "NGO Partner",
    headline: "Campaign organizer",
    description: "Launch cleanup campaigns.",
    detail:
      "Designed for groups coordinating people, events, and neighborhood-scale environmental action.",
    status: "Ready to organize",
    icon: "earth-africa",
    iconFamily: "fontawesome",
    accent: "#0EA5E9",
    accentSoft: "#E0F2FE",
  },
  worker: {
    title: "Green Soldier",
    headline: "Field responder",
    description: "Clear verified waste tasks.",
    detail:
      "A practical mode for workers who need fast access to assigned cleanup tasks and proof flows.",
    status: "Ready for cleanup",
    icon: "truck-fast-outline",
    iconFamily: "material",
    accent: "#F59E0B",
    accentSoft: "#FEF3C7",
  },
  champion: {
    title: "Champion",
    headline: "Area moderator",
    description: "Verify reports & moderate.",
    detail:
      "Built for trusted users who help maintain accuracy, resolve edge cases, and guide local momentum.",
    status: "Ready to verify",
    icon: "shield-halved",
    iconFamily: "fontawesome",
    accent: "#8B5CF6",
    accentSoft: "#F3E8FF",
  },
  authority: {
    title: "Authority",
    headline: "City operations",
    description: "Review escalations & monitor impact.",
    detail:
      "A decision-focused role for municipal teams that need visibility into escalations and verified impact.",
    status: "Ready for oversight",
    icon: "office-building-cog-outline",
    iconFamily: "material",
    accent: "#F43F5E",
    accentSoft: "#FFE4E6",
  },
};

export function RoleSelectionScreen({ navigation }: Props) {
  const setRole = useAppStore((state) => state.setRole);
  const activeRole = useAppStore((state) => state.activeRole);
  const [selectedRole, setSelectedRole] = useState<AppRole>(
    activeRole ?? "citizen",
  );
  const [activeModal, setActiveModal] = useState<"none" | "details" | "guide">(
    "none",
  );

  const selectedConfig = useMemo(
    () => roleConfig[selectedRole],
    [selectedRole],
  );

  const handleContinue = () => {
    // A slightly firmer vibration for a primary action
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRole(selectedRole);
    // navigation.navigate("Home"); 
  };

  const renderRoleIcon = (role: AppRole, size = 22) => {
    const config = roleConfig[role];
    if (config.iconFamily === "fontawesome") {
      return (
        <FontAwesome6
          name={config.icon as keyof typeof FontAwesome6.glyphMap}
          size={size}
          color={config.accent}
        />
      );
    }
    return (
      <MaterialCommunityIcons
        name={config.icon as keyof typeof MaterialCommunityIcons.glyphMap}
        size={size + 2}
        color={config.accent}
      />
    );
  };

  const renderBentoCard = (role: AppRole, isFullWidth = false) => {
    const config = roleConfig[role];
    const isSelected = selectedRole === role;

    return (
      <Pressable
        key={role}
        style={({ pressed }) => [
          styles.bentoCard,
          isSelected && styles.bentoCardSelected,
          isSelected && { borderColor: config.accent },
          isFullWidth && { flex: 1, flexDirection: "row", alignItems: "center" },
          pressed && { transform: [{ scale: 0.97 }] }, 
        ]}
        onPress={() => {
          // A very soft, subtle tick when switching cards
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setSelectedRole(role);
        }}
      >
        <View style={[styles.selectedRing, isSelected && { borderColor: config.accent, backgroundColor: config.accent }]}>
          {isSelected && (
            <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />
          )}
        </View>

        <View style={[styles.iconBox, { backgroundColor: config.accentSoft }]}>
          {renderRoleIcon(role)}
        </View>

        <View style={[styles.bentoInfo, isFullWidth && { marginLeft: 16, flex: 1 }]}>
          <Text style={styles.bentoTitle}>{config.title}</Text>
          <Text style={styles.bentoDescription}>{config.description}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <ScreenSafeArea edges={["top", "bottom"]} style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Solid Background Accents */}
        <View style={styles.bgBlobGreen} />
        <View style={styles.bgBlobBlue} />

        <View style={styles.content}>
          
          {/* Header */}
          <View style={styles.headerArea}>
            <View style={styles.topNav}>
              <Pressable 
                style={({ pressed }) => [styles.navButton, pressed && { transform: [{ scale: 0.9 }] }]} 
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  navigation.goBack();
                }}
              >
                <MaterialCommunityIcons name="arrow-left" size={22} color="#0F172A" />
              </Pressable>
              
              <Pressable 
                style={({ pressed }) => [styles.navButton, pressed && { transform: [{ scale: 0.9 }] }]} 
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveModal("guide");
                }}
              >
                <MaterialCommunityIcons name="help" size={20} color="#64748B" />
              </Pressable>
            </View>

            <Text style={styles.headerTitle}>Select Persona</Text>
            <Text style={styles.headerSubtitle}>Customize your ecosystem experience.</Text>
          </View>

          {/* Fitted Bento Grid */}
          <View style={styles.bentoGrid}>
            <View style={styles.bentoRow}>
              {renderBentoCard("citizen")}
              {renderBentoCard("ngo")}
            </View>
            <View style={styles.bentoRow}>
              {renderBentoCard("worker")}
              {renderBentoCard("champion")}
            </View>
            <View style={[styles.bentoRow, { flex: 0.65 }]}>
              {renderBentoCard("authority", true)}
            </View>
          </View>

          {/* Bottom Action */}
          <Pressable 
            style={({ pressed }) => [styles.btnFluid, pressed && { transform: [{ scale: 0.98 }] }]} 
            onPress={handleContinue}
          >
            <Text style={styles.btnFluidText}>Continue Setup</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
          </Pressable>

        </View>

        {/* Modal */}
        <Modal
          animationType="fade"
          transparent
          visible={activeModal === "guide"}
          onRequestClose={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveModal("none");
          }}
        >
          <Pressable 
            style={styles.modalOverlay} 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setActiveModal("none");
            }}
          >
            <Pressable style={styles.modalContent}>
              <Pressable 
                style={styles.closeButton} 
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveModal("none");
                }}
              >
                <MaterialCommunityIcons name="close" size={24} color="#0F172A" />
              </Pressable>

              <Text style={styles.modalTitle}>How role setup works</Text>
              <Text style={styles.modalBody}>
                Pick the role that best matches how you want to participate. You can still change roles later from your profile settings.
              </Text>

              <View style={styles.guideList}>
                {appRoles.map((r) => (
                  <Text key={r} style={styles.guideItem}>
                    <Text style={{ fontWeight: "700", color: "#0F172A" }}>{roleConfig[r].title}:</Text> {roleConfig[r].headline.toLowerCase()}.
                  </Text>
                ))}
              </View>
            </Pressable>
          </Pressable>
        </Modal>

      </View>
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#F8FAFC", 
  },
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    overflow: "hidden",
  },
  /* --- BACKGROUND BLOBS --- */
  bgBlobGreen: {
    position: "absolute",
    top: "-5%",
    left: -50,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: "#00D65B",
    opacity: 0.05,
  },
  bgBlobBlue: {
    position: "absolute",
    bottom: "5%",
    right: -100,
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: "#0EA5E9",
    opacity: 0.05,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    justifyContent: "space-between",
  },
  /* --- HEADER & NAVIGATION --- */
  headerArea: {
    marginBottom: 20,
  },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -1,
    lineHeight: 38,
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#64748B",
    marginTop: 6,
  },
  /* --- SOLID BENTO GRID --- */
  bentoGrid: {
    flex: 1,
    gap: 14,
    marginBottom: 28,
  },
  bentoRow: {
    flex: 1,
    flexDirection: "row",
    gap: 14,
  },
  bentoCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0", 
    borderRadius: 28, 
    padding: 16,
    justifyContent: "space-between",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  bentoCardSelected: {
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  selectedRing: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  bentoInfo: {
    marginTop: "auto",
  },
  bentoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  bentoDescription: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
    fontWeight: "500",
  },
  /* --- BOTTOM BUTTON --- */
  btnFluid: {
    height: 60,
    borderRadius: 20, 
    backgroundColor: "#0F172A",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 6,
  },
  btnFluidText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  /* --- MODALS --- */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    borderRadius: 32,
    backgroundColor: "#FFFFFF", 
    padding: 28,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 10,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
    paddingRight: 40,
    letterSpacing: -0.5,
  },
  modalBody: {
    fontSize: 15,
    lineHeight: 22,
    color: "#64748B",
    marginBottom: 24,
  },
  guideList: {
    gap: 14,
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 20,
  },
  guideItem: {
    fontSize: 14,
    lineHeight: 20,
    color: "#475569",
  },
});