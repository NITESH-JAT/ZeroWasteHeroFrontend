import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ScreenSafeArea } from "../../components/ui/ScreenSafeArea";
import { AppRole, appRoles, roleLabels } from "../../constants/roles";
import { RootStackParamList } from "../../navigation/types";
import { useAppStore } from "../../store/useAppStore";
import { authService } from "../../services/authService";
import * as ImagePicker from "expo-image-picker";

type Props = NativeStackScreenProps<RootStackParamList, "RoleSelection">;

const { width } = Dimensions.get("window");

type RoleConfig = {
  title: string;
  headline: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap | keyof typeof FontAwesome6.glyphMap;
  iconFamily: "material" | "fontawesome";
  accent: string;
  accentSoft: string;
};

// Added the Scrapper role to the UI!
const roleConfig: Record<AppRole, RoleConfig> = {
  citizen: {
    title: "Citizen",
    headline: "Community reporter",
    description: "Report waste & earn rewards.",
    icon: "street-view",
    iconFamily: "fontawesome",
    accent: "#00D65B",
    accentSoft: "#F0FDF4",
  },
  ngo: {
    title: "NGO Partner",
    headline: "Campaign organizer",
    description: "Launch cleanup campaigns.",
    icon: "earth-africa",
    iconFamily: "fontawesome",
    accent: "#0EA5E9",
    accentSoft: "#E0F2FE",
  },
  worker: {
    title: "Green Soldier",
    headline: "Field responder",
    description: "Clear verified waste tasks.",
    icon: "truck-fast-outline",
    iconFamily: "material",
    accent: "#F59E0B",
    accentSoft: "#FEF3C7",
  },
  champion: {
    title: "Champion",
    headline: "Area moderator",
    description: "Verify reports & moderate.",
    icon: "shield-halved",
    iconFamily: "fontawesome",
    accent: "#8B5CF6",
    accentSoft: "#F3E8FF",
  },
  authority: {
    title: "Authority",
    headline: "City operations",
    description: "Review impact & penalties.",
    icon: "office-building-cog-outline",
    iconFamily: "material",
    accent: "#F43F5E",
    accentSoft: "#FFE4E6",
  },
  scrapper: {
    title: "Scrap Collector",
    headline: "Marketplace buyer",
    description: "Bid on and collect dry waste.",
    icon: "recycle-variant",
    iconFamily: "material",
    accent: "#14B8A6",
    accentSoft: "#ECFDF5",
  },
};

export function RoleSelectionScreen({ navigation }: Props) {
  const [selectedRole, setSelectedRole] = useState<AppRole>("citizen");
  
  // Auth Sheet State
  const [showAuthSheet, setShowAuthSheet] = useState(false);
  const [authMode, setAuthMode] = useState<"register" | "login">("register");
  
  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [govIdUri, setGovIdUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  

  const selectedConfig = useMemo(() => roleConfig[selectedRole], [selectedRole]);

  // Triggers the bottom sheet to open
  const handleOpenAuth = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAuthMode("register");
    setErrorMsg("");
    setShowAuthSheet(true);
  };

  const pickGovId = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    quality: 0.8,
  });
  if (!result.canceled && result.assets[0]?.uri) {
    setGovIdUri(result.assets[0].uri);
  }
};

  // Handles the actual API call
  const handleSubmit = async () => {
    if (!email || !password || (authMode === "register" && (!firstName || !lastName))) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      if (authMode === "register") {
        if (selectedRole === "scrapper" && !govIdUri) {
          setErrorMsg("Please upload your Government ID.");
          return;
        }
        await authService.register(firstName, lastName, email, password, selectedRole, govIdUri || undefined);
      } else {
        await authService.login(email, password);
      }
      
      // On success, Zustand updates automatically, and RootNavigator will unmount this screen!
      // We trigger a success haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowAuthSheet(false);
      
    } catch (error: any) {
      setErrorMsg(error.message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleIcon = (role: AppRole, size = 22) => {
    const config = roleConfig[role];
    if (config.iconFamily === "fontawesome") {
      return <FontAwesome6 name={config.icon as any} size={size} color={config.accent} />;
    }
    return <MaterialCommunityIcons name={config.icon as any} size={size + 2} color={config.accent} />;
  };

  const renderBentoCard = (role: AppRole) => {
    const config = roleConfig[role];
    const isSelected = selectedRole === role;

    return (
      <Pressable
        key={role}
        style={({ pressed }) => [
          styles.bentoCard,
          isSelected && styles.bentoCardSelected,
          isSelected && { borderColor: config.accent },
          pressed && { transform: [{ scale: 0.97 }] },
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setSelectedRole(role);
        }}
      >
        <View style={[styles.selectedRing, isSelected && { borderColor: config.accent, backgroundColor: config.accent }]}>
          {isSelected && <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />}
        </View>

        <View style={[styles.iconBox, { backgroundColor: config.accentSoft }]}>
          {renderRoleIcon(role)}
        </View>

        <View style={styles.bentoInfo}>
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
          <View style={styles.headerArea}>
            <View style={styles.topNav}>
              <Pressable 
                style={({ pressed }) => [styles.navButton, pressed && { transform: [{ scale: 0.9 }] }]} 
                onPress={() => navigation.goBack()}
              >
                <MaterialCommunityIcons name="arrow-left" size={22} color="#0F172A" />
              </Pressable>
            </View>

            <Text style={styles.headerTitle}>Select Persona</Text>
            <Text style={styles.headerSubtitle}>Customize your ecosystem experience.</Text>
          </View>

          {/* Scrollable Bento Grid to fit the new Scrapper role */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.bentoGrid}>
            <View style={styles.bentoRow}>
              {renderBentoCard("citizen")}
              {renderBentoCard("scrapper")}
            </View>
            <View style={styles.bentoRow}>
              {renderBentoCard("worker")}
              {renderBentoCard("champion")}
            </View>
            <View style={styles.bentoRow}>
               {renderBentoCard("ngo")}
              {renderBentoCard("authority")}
            </View>
            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Bottom Action */}
          <Pressable 
            style={({ pressed }) => [styles.btnFluid, { backgroundColor: selectedConfig.accent }, pressed && { transform: [{ scale: 0.98 }] }]} 
            onPress={handleOpenAuth}
          >
            <Text style={styles.btnFluidText}>Continue as {selectedConfig.title}</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* --- AUTH BOTTOM SHEET MODAL --- */}
        <Modal
          animationType="slide"
          transparent
          visible={showAuthSheet}
          onRequestClose={() => setShowAuthSheet(false)}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalOverlay}
          >
            <Pressable style={styles.modalBackdrop} onPress={() => setShowAuthSheet(false)} />
            
            <View style={styles.sheetContent}>
              <View style={styles.dragIndicator} />
              
              <Text style={styles.sheetTitle}>
                {authMode === "register" ? `Join as ${selectedConfig.title}` : "Welcome Back"}
              </Text>
              
              {errorMsg ? (
                <View style={styles.errorBox}>
                  <MaterialCommunityIcons name="alert-circle-outline" size={16} color="#EF4444" />
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
              ) : null}

              {authMode === "register" && (
                <View style={styles.rowInputs}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="First Name"
                    placeholderTextColor="#94A3B8"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                  />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Last Name"
                    placeholderTextColor="#94A3B8"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                  />
                </View>
              )}

              {authMode === "register" && selectedRole === "scrapper" && (
                <Pressable 
                  style={[styles.input, { justifyContent: 'center', alignItems: 'center', backgroundColor: govIdUri ? '#ECFDF5' : '#F8FAFC' }]} 
                  onPress={pickGovId}
                >
                  <Text style={{ color: govIdUri ? '#10B981' : '#64748B', fontWeight: '600' }}>
                    {govIdUri ? "Gov ID Attached" : "📷 Upload Gov ID (Required)"}
                  </Text>
                </Pressable>
              )}

              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <Pressable 
                style={({ pressed }) => [styles.submitBtn, { backgroundColor: selectedConfig.accent }, pressed && { opacity: 0.9 }]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitBtnText}>
                    {authMode === "register" ? "Create Account" : "Sign In"}
                  </Text>
                )}
              </Pressable>

              <Pressable 
                style={styles.toggleAuthModeBtn}
                onPress={() => setAuthMode(authMode === "register" ? "login" : "register")}
              >
                <Text style={styles.toggleAuthModeText}>
                  {authMode === "register" 
                    ? "Already have an account? Sign In" 
                    : "Need an account? Create one"}
                </Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </Modal>

      </View>
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#F8FAFC" },
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  bgBlobGreen: { position: "absolute", top: "-5%", left: -50, width: width * 0.8, height: width * 0.8, borderRadius: width * 0.4, backgroundColor: "#00D65B", opacity: 0.05 },
  bgBlobBlue: { position: "absolute", bottom: "5%", right: -100, width: width * 0.9, height: width * 0.9, borderRadius: width * 0.45, backgroundColor: "#0EA5E9", opacity: 0.05 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
  headerArea: { marginBottom: 20 },
  topNav: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  navButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E2E8F0", justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 34, fontWeight: "800", color: "#0F172A", letterSpacing: -1 },
  headerSubtitle: { fontSize: 15, fontWeight: "500", color: "#64748B", marginTop: 6 },
  bentoGrid: { gap: 14, paddingBottom: 20 },
  bentoRow: { flexDirection: "row", gap: 14 },
  bentoCard: { flex: 1, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 28, padding: 16, minHeight: 140, justifyContent: "space-between" },
  bentoCardSelected: { borderWidth: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 6 },
  selectedRing: { position: "absolute", top: 14, right: 14, width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: "#E2E8F0", justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF" },
  iconBox: { width: 48, height: 48, borderRadius: 16, justifyContent: "center", alignItems: "center", marginBottom: 12 },
  bentoInfo: { marginTop: "auto" },
  bentoTitle: { fontSize: 16, fontWeight: "700", color: "#0F172A", marginBottom: 4 },
  bentoDescription: { fontSize: 13, color: "#64748B", lineHeight: 18, fontWeight: "500" },
  btnFluid: { height: 60, borderRadius: 20, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 10, shadowColor: "#0F172A", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 6 },
  btnFluidText: { color: "#FFFFFF", fontSize: 17, fontWeight: "700" },
  
  /* --- BOTTOM SHEET STYLES --- */
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(15, 23, 42, 0.4)" },
  sheetContent: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 24, paddingTop: 16, paddingBottom: Platform.OS === "ios" ? 40 : 24, shadowColor: "#000", shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 20 },
  dragIndicator: { width: 40, height: 5, borderRadius: 3, backgroundColor: "#E2E8F0", alignSelf: "center", marginBottom: 24 },
  sheetTitle: { fontSize: 24, fontWeight: "800", color: "#0F172A", marginBottom: 20 },
  rowInputs: { flexDirection: "row", gap: 12, marginBottom: 12 },
  input: { backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: "#0F172A", marginBottom: 12 },
  submitBtn: { height: 56, borderRadius: 16, justifyContent: "center", alignItems: "center", marginTop: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  submitBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  toggleAuthModeBtn: { marginTop: 20, alignItems: "center", paddingVertical: 10 },
  toggleAuthModeText: { color: "#64748B", fontSize: 14, fontWeight: "600" },
  errorBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#FEF2F2", padding: 12, borderRadius: 12, marginBottom: 16, gap: 8 },
  errorText: { color: "#EF4444", fontSize: 13, fontWeight: "500", flex: 1 },
});