//src/screens/tabs/HomeScreen.tsx
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ScreenSafeArea } from "../../components/ui/ScreenSafeArea";
import { roleLabels } from "../../constants/roles";
import type { AppPageId } from "../../navigation/pageRegistry";
import type { RootStackParamList } from "../../navigation/types";
import { useAppStore } from "../../store/useAppStore";
import * as Haptics from "expo-haptics";
import { userService } from "../../services/userService";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { authorityService } from "../../services/authorityService";

const { width } = Dimensions.get("window");

const roleConfig = {
  citizen: { accent: "#00E676", icon: "street-view" },
  ngo: { accent: "#0EA5E9", icon: "earth-africa" },
  worker: { accent: "#F59E0B", icon: "truck-fast-outline" },
  champion: { accent: "#8B5CF6", icon: "shield-halved" },
  authority: { accent: "#F43F5E", icon: "office-building-cog-outline" },
  // Add this new line for the Admin!
  admin: { accent: "#1E293B", icon: "shield-crown-outline" },
  scrapper: {
    title: "Scrap Collector",
    accent: "#14B8A6",
    accentSoft: "#ECFDF5",
    icon: "recycle-variant"
  },
};

const AnimatedPressable = ({ children, onPress, style }: any) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 20, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 20, stiffness: 400 });
      }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (onPress) onPress();
      }}
    >
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
};

const SectionHeader = ({ title, actionText, onPress }: { title: string; actionText?: string; onPress?: () => void }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {actionText && (
      <AnimatedPressable style={styles.sectionActionPill} onPress={onPress}>
        <Text style={styles.sectionActionText}>{actionText}</Text>
      </AnimatedPressable>
    )}
  </View>
);

const ActionCard = ({ icon, title, subtitle, color, onPress }: any) => (
  <AnimatedPressable style={styles.actionCard} onPress={onPress}>
    <View style={styles.actionCardHeader}>
      <View style={[styles.actionIconBox, { backgroundColor: `${color}1A` }]}>
        <MaterialCommunityIcons name={icon} size={26} color={color} />
      </View>
      <MaterialCommunityIcons name="arrow-top-right" size={20} color="#CBD5E1" />
    </View>
    <Text style={styles.actionTitle} numberOfLines={1}>{title}</Text>
    <Text style={styles.actionSubtitle} numberOfLines={2}>{subtitle}</Text>
  </AnimatedPressable>
);

const ListItem = ({ icon, title, subtitle, tag, tagColor = "#0F172A", accent, onPress }: any) => (
  <AnimatedPressable style={styles.listItem} onPress={onPress}>
    <View style={[styles.listColorStripe, { backgroundColor: accent }]} />
    <View style={[styles.listIconBox, { backgroundColor: `${accent}10` }]}>
      <MaterialCommunityIcons name={icon} size={22} color={accent} />
    </View>
    <View style={styles.listTextContent}>
      <Text style={styles.listTitle} numberOfLines={1}>{title}</Text>
      <Text style={styles.listSubtitle} numberOfLines={1}>{subtitle}</Text>
    </View>
    {tag ? (
      <View style={[styles.listTag, { backgroundColor: `${tagColor}15` }]}>
        <Text style={[styles.listTagText, { color: tagColor }]}>{tag}</Text>
      </View>
    ) : (
      <MaterialCommunityIcons name="chevron-right" size={20} color="#CBD5E1" />
    )}
  </AnimatedPressable>
);

const MeshHeroCard = ({ config, label, value, stat1Value, stat1Label, stat2Value, stat2Label, icon }: any) => (
  <View style={styles.heroCardWrapper}>
    <View style={styles.heroCard}>
      <View style={[styles.heroGlow1, { backgroundColor: config.accent }]} />
      <View style={[styles.heroGlow2, { backgroundColor: config.accent }]} />
      <MaterialCommunityIcons name={icon} size={140} color="#FFFFFF" style={styles.heroBgIcon} />

      <View style={styles.heroContent}>
        <View style={styles.heroTopRow}>
          <Text style={styles.heroLabel}>{label}</Text>
          <View style={styles.heroIconWrapper}>
            <MaterialCommunityIcons name="trending-up" size={18} color={config.accent} />
          </View>
        </View>

        <Text style={styles.heroValue}>{value}</Text>

        <View style={styles.heroDivider} />

        <View style={styles.heroStatsRow}>
          <View style={styles.heroStatItem}>
            <Text style={styles.heroStatValue}>{stat1Value}</Text>
            <Text style={styles.heroStatLabel}>{stat1Label}</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStatItem}>
            <Text style={styles.heroStatValue}>{stat2Value}</Text>
            <Text style={styles.heroStatLabel}>{stat2Label}</Text>
          </View>
        </View>
      </View>
    </View>
  </View>
);

// --- DASHBOARDS ---

const CitizenDashboard = ({ config, openPage, userProfile, navigation }: any) => {
  const [stats, setStats] = useState({ verifiedReports: 0, campaignsJoined: 0 });

  useEffect(() => {
    userService.getMyStats().then(setStats);
  }, []);

  return (
    <>
      {/* REAL DATA HERO CARD */}
      <MeshHeroCard 
        config={config} 
        icon="leaf-circle" 
        label="GreenPoints Balance" 
        value={userProfile?.greenPoints?.toLocaleString() || "0"} 
        stat1Value={stats.verifiedReports.toString()} 
        stat1Label="Verified Reports" 
        stat2Value={stats.campaignsJoined.toString()} 
        stat2Label="Items Sold" 
      />

      <SectionHeader title="Marketplace" actionText="Post Scrap" onPress={() => navigation.navigate("PostScrap")} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionGrid}>
        <ActionCard icon="plus-circle" title="Sell Scrap" subtitle="Turn recyclables into cash" color="#14B8A6" onPress={() => navigation.navigate("PostScrap")} />
        <ActionCard icon="format-list-bulleted" title="My Listings" subtitle="Manage your active scrap bids" color="#0EA5E9" onPress={() => navigation.navigate("CitizenHistory", { initialTab: 'listings' })} />
      </ScrollView>

      <SectionHeader title="Civic Action" actionText="Report Waste" onPress={() => navigation.navigate("ReportWaste")} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionGrid}>
        <ActionCard icon="camera-plus" title="Report Waste" subtitle="Launch the citizen report flow" color={config.accent} onPress={() => navigation.navigate("ReportWaste")} />
        <ActionCard icon="progress-clock" title="My Reports" subtitle="Check verification status" color="#F59E0B" onPress={() => navigation.navigate("CitizenHistory", { initialTab: 'reports' })} />
      </ScrollView>
    </>
  );
};

const NgoDashboard = ({ config, openPage }: { config: any; openPage: (pageId: AppPageId) => void }) => (
  <>
    <MeshHeroCard config={config} icon="earth" label="NGO Dashboard" value="1,240 kg" stat1Value="12" stat1Label="Active Campaigns" stat2Value="340" stat2Label="Volunteers" />
    {/* ... remaining unchanged NGO items ... */}
    <SectionHeader title="Active Campaigns" actionText="Manage All" onPress={() => openPage("ngoCampaignHistory")} />
    <View style={styles.listWrapper}>
      <ListItem icon="beach" title="City Beach Cleanup" subtitle="Tomorrow, 08:00 AM" tag="Active" tagColor={config.accent} accent={config.accent} onPress={() => openPage("campaignBeachCleanup")} />
    </View>
  </>
);

const WorkerDashboard = ({ config, openPage, navigation }: any) => {
  const [tasks, setTasks] = React.useState<any[]>([]);

  React.useEffect(() => {
    import("../../services/taskService").then(m => m.taskService.getMyTasks().then(setTasks));
  }, []);

  const pendingTasks = tasks.filter(t => t.status === 'ASSIGNED');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED' || t.status === 'VERIFIED');
  const nextTask = pendingTasks[0];

  return (
    <>
      <MeshHeroCard config={config} icon="truck-check" label="My Workload" value={`${pendingTasks.length} Pending`} stat1Value={completedTasks.length.toString()} stat1Label="Completed" stat2Value="100%" stat2Label="Success Rate" />
      
      <SectionHeader title="Next Task Priority" actionText="Open Flow" onPress={() => navigation.navigate("WorkerTask")} />
      <View style={styles.listWrapper}>
        {nextTask ? (
          <ListItem 
            icon="alert-circle" 
            title="Assigned Cleanup Task" 
            subtitle={nextTask.description || "Location coordinates provided"} 
            tag={`${nextTask.rewardPoints} Pts`} 
            tagColor="#F43F5E" 
            accent={config.accent} 
            onPress={() => navigation.navigate("WorkerTask")} 
          />
        ) : (
          <Text style={{ textAlign: 'center', color: '#64748B', padding: 20 }}>No tasks assigned to you right now.</Text>
        )}
      </View>
    </>
  );
};

const ChampionDashboard = ({ config, navigation }: any) => {
  const [stats, setStats] = useState({ pendingCount: 0, urgentCount: 0, accuracy: "98%" });
  const [urgentReports, setUrgentReports] = useState<any[]>([]);

  React.useEffect(() => {
    import("../../services/championService").then(m => {
      m.championService.getStats().then(setStats);
      m.championService.getPendingReports().then(reports => {
        // Just grab the first 2 reports for the home screen "urgent" preview
        setUrgentReports(reports.slice(0, 2)); 
      });
    });
  }, []);

  return (
    <>
      <MeshHeroCard config={config} icon="shield-star" label="Pending Verifications" value={`${stats.pendingCount} Reports`} stat1Value={stats.urgentCount.toString()} stat1Label="Urgent Reports" stat2Value={stats.accuracy} stat2Label="Accuracy Score" />
      
      <SectionHeader title="Urgent Reports" actionText="Open Queue" onPress={() => navigation.navigate("VerifyReports")} />
      <View style={styles.listWrapper}>
        {urgentReports.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#64748B', marginVertical: 10 }}>No urgent reports right now.</Text>
        ) : (
          urgentReports.map(report => (
            <ListItem 
              key={report.id} 
              icon="alert-circle-outline" 
              title={report.category} 
              subtitle={report.description || "Pending review..."} 
              tag="Urgent" 
              tagColor="#F43F5E" 
              accent={config.accent} 
              onPress={() => navigation.navigate("VerifyReports")} 
            />
          ))
        )}
      </View>
    </>
  );
};

const AuthorityDashboard = ({ config, openPage, navigation }: any) => {
  const [stats, setStats] = React.useState({ totalReports: 0, resolvedReports: 0, cleanRate: "0%", activeNgos: 0 });

  React.useEffect(() => {
    authorityService.getStats().then(setStats);
  }, []);

  return (
    <>
      <MeshHeroCard 
        config={config} 
        icon="office-building" 
        label="City Segregation Rate" 
        value={stats.cleanRate} 
        stat1Value={stats.resolvedReports.toString()} 
        stat1Label="Resolved Reports" 
        stat2Value={stats.activeNgos.toString()} 
        stat2Label="Active NGOs" 
      />
      <SectionHeader title="City Operations" />
      <View style={styles.actionGrid}>
        <ActionCard icon="file-document-check" title="NGO Directory" subtitle="View active NGO partners" color={config.accent} onPress={() => navigation.navigate("Explore")} />
        <ActionCard icon="gavel" title="Penalties" subtitle="Manage defaulters & fines" color="#F43F5E" onPress={() => navigation.navigate("Explore")} />
      </View>
    </>
  );
};

// NEW SCRAPPER DASHBOARD MATCHING YOUR UI!
const ScrapperDashboard = ({ config, navigation }: any) => {
  const [stats, setStats] = useState({ bidsPlaced: 0, pickupsCompleted: 0 });

  React.useEffect(() => {
    import("../../services/userService").then(m => m.userService.getMyStats().then(setStats));
  }, []);

  return (
    <>
      <MeshHeroCard config={config} icon="recycle-variant" label="Marketplace Activity" value="Active" stat1Value={stats.bidsPlaced.toString()} stat1Label="Bids Placed" stat2Value={stats.pickupsCompleted.toString()} stat2Label="Completed Pickups" />
      <SectionHeader title="Marketplace Feed" actionText="View All" onPress={() => navigation.navigate("Explore")} />
      <View style={styles.actionGrid}>
        <ActionCard icon="storefront-outline" title="Browse Scrap" subtitle="Find available waste in your city" color={config.accent} onPress={() => navigation.navigate("Explore")} />
        <ActionCard icon="hand-coin-outline" title="My Bids" subtitle="Track your pending offers" color="#0EA5E9" onPress={() => navigation.navigate("ScrapperBids")} />
      </View>
    </>
  );
};

export function HomeScreen() {
  // LIVE DATA: Grabbing both role AND full profile from Zustand
const { activeRole: rawRole, userProfile } = useAppStore(); const activeRole = (rawRole || "").toLowerCase();  
  const navigation = useNavigation<any>(); // <--- Use generic 'any' to allow switching to tabs easily

  const openPage = (pageId: AppPageId) => navigation.navigate("Page", { pageId });

  if (!activeRole) {
    return (
      <ScreenSafeArea style={styles.safeArea}>
        <View style={styles.center}>
          <MaterialCommunityIcons name="account-question-outline" size={56} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>No Persona Selected</Text>
          <Text style={styles.emptySubtitle}>Head back and select a role to view your ecosystem dashboard.</Text>
        </View>
      </ScreenSafeArea>
    );
  }

  const currentConfig = roleConfig[activeRole];

  return (
    <ScreenSafeArea style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTextWrap}>
          {/* LIVE DATA: Greeting the user by their actual First Name */}
          <Text style={styles.greeting}>Good morning, {userProfile?.firstName || "Hero"}</Text>
          <View style={styles.roleBadgeContainer}>
            <View style={[styles.roleBadgeDot, { backgroundColor: currentConfig.accent }]} />
            <Text style={styles.roleBadgeText}>{(roleLabels[activeRole] || activeRole || '').toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <AnimatedPressable style={styles.iconBtn} onPress={() => Alert.alert("Notifications", "You have no new notifications.")}>
            <Feather name="bell" size={20} color="#0F172A" />
          </AnimatedPressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeRole === "citizen" && <CitizenDashboard config={currentConfig} openPage={openPage} userProfile={userProfile} navigation={navigation} />}
        {activeRole === "ngo" && <NgoDashboard config={currentConfig} openPage={openPage} />}
        {activeRole === "worker" && <WorkerDashboard config={currentConfig} openPage={openPage} />}
        {activeRole === "champion" && <ChampionDashboard config={currentConfig} navigation={navigation} openPage={openPage} />}
        {(activeRole === "authority" || activeRole === "admin") && <AuthorityDashboard config={currentConfig} openPage={openPage} navigation={navigation} />}
        {activeRole === "scrapper" && <ScrapperDashboard config={currentConfig} navigation={navigation} />}

        <View style={{ height: 120 }} />
      </ScrollView>
    </ScreenSafeArea>
  );
}

// ... Keep ALL your exact styles down here ...
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8FAFC" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32 },
  emptyTitle: { fontSize: 22, fontWeight: "800", color: "#0F172A", marginTop: 20 },
  emptySubtitle: { fontSize: 15, color: "#64748B", textAlign: "center", marginTop: 8, lineHeight: 22 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingTop: Platform.OS === "ios" ? 12 : 24, paddingBottom: 20, backgroundColor: "#F8FAFC" },
  headerTextWrap: { flex: 1 },
  greeting: { fontSize: 24, fontWeight: "800", color: "#0F172A", letterSpacing: -0.5 },
  roleBadgeContainer: { flexDirection: "row", alignItems: "center", marginTop: 6, backgroundColor: "#FFFFFF", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: "#E2E8F0", alignSelf: "flex-start" },
  roleBadgeDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  roleBadgeText: { fontSize: 11, fontWeight: "800", color: "#475569", textTransform: "uppercase", letterSpacing: 0.5 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E2E8F0", justifyContent: "center", alignItems: "center" },
  notificationDot: { position: "absolute", top: 10, right: 12, width: 8, height: 8, borderRadius: 4, borderWidth: 2, borderColor: "#FFFFFF" },
  scrollContent: { paddingHorizontal: 24, paddingTop: 8 },
  heroCardWrapper: { marginBottom: 32 },
  heroCard: { borderRadius: 32, backgroundColor: "#0B1120", padding: 24, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.2, shadowRadius: 24, elevation: 10 },
  heroGlow1: { position: "absolute", top: -40, right: -20, width: 150, height: 150, borderRadius: 75, opacity: 0.15 },
  heroGlow2: { position: "absolute", bottom: -60, left: -40, width: 200, height: 200, borderRadius: 100, opacity: 0.1 },
  heroBgIcon: { position: "absolute", right: -20, bottom: -20, opacity: 0.03, transform: [{ rotate: "-15deg" }] },
  heroContent: { position: "relative", zIndex: 2 },
  heroTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  heroLabel: { fontSize: 13, fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.8 },
  heroIconWrapper: { width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.1)", justifyContent: "center", alignItems: "center" },
  heroValue: { fontSize: 48, fontWeight: "800", color: "#FFFFFF", letterSpacing: -1.5 },
  heroDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.1)", marginVertical: 20 },
  heroStatsRow: { flexDirection: "row", alignItems: "center" },
  heroStatItem: { flex: 1 },
  heroStatDivider: { width: 1, height: 30, backgroundColor: "rgba(255,255,255,0.1)", marginHorizontal: 20 },
  heroStatValue: { fontSize: 22, fontWeight: "800", color: "#FFFFFF", marginBottom: 4 },
  heroStatLabel: { fontSize: 12, fontWeight: "600", color: "#94A3B8" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: "#0F172A", letterSpacing: -0.5 },
  sectionActionPill: { backgroundColor: "#F1F5F9", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  sectionActionText: { fontSize: 12, fontWeight: "800", color: "#64748B" },
  actionGrid: { paddingBottom:20, },
  actionCard: { 
    width: width * 0.65,
    backgroundColor: "#FFFFFF", 
    borderRadius: 24, 
    padding: 16, 
    borderWidth: 1, 
    borderColor: "#E2E8F0", 
    shadowColor: "#0F172A", 
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 12, 
    elevation: 3,
    marginRight: 16
  },
  actionCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  actionIconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  actionTitle: { fontSize: 14, fontWeight: "700", color: "#0F172A", marginBottom: 4 },
  actionSubtitle: { fontSize: 12, color: "#64748B", lineHeight: 16 },
  listWrapper: { gap: 12, marginBottom: 36 },
  listItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "#E2E8F0", overflow: "hidden", shadowColor: "#0F172A", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  listColorStripe: { position: "absolute", left: 0, top: 0, bottom: 0, width: 4 },
  listIconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: "center", alignItems: "center", marginRight: 16, marginLeft: 4 },
  listTextContent: { flex: 1, marginRight: 12 },
  listTitle: { fontSize: 15, fontWeight: "800", color: "#0F172A", marginBottom: 4 },
  listSubtitle: { fontSize: 13, color: "#64748B", fontWeight: "500" },
  listTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  listTagText: { fontSize: 12, fontWeight: "800" },
});