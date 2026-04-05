import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
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
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

const { width } = Dimensions.get("window");

const roleConfig = {
  citizen: { accent: "#00E676", icon: "street-view" },
  ngo: { accent: "#0EA5E9", icon: "earth-africa" },
  worker: { accent: "#F59E0B", icon: "truck-fast-outline" },
  champion: { accent: "#8B5CF6", icon: "shield-halved" },
  authority: { accent: "#F43F5E", icon: "office-building-cog-outline" },
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
    <Text style={styles.actionTitle}>{title}</Text>
    <Text style={styles.actionSubtitle}>{subtitle}</Text>
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

const CitizenDashboard = ({ config, openPage }: { config: any; openPage: (pageId: AppPageId) => void }) => (
  <>
    <MeshHeroCard config={config} icon="leaf-circle" label="GreenPoints Balance" value="3,250" stat1Value="42" stat1Label="Verified Reports" stat2Value="5" stat2Label="Campaigns Joined" />

    <SectionHeader title="Streak & Badges" actionText="View All" onPress={() => openPage("streakProgress")} />
    <View style={styles.listWrapper}>
      <ListItem icon="fire" title="Active Streak" subtitle="7-day consistency streak is active" tag="+80 Bonus" tagColor="#F59E0B" accent={config.accent} onPress={() => openPage("streakProgress")} />
      <ListItem icon="medal-outline" title="Badge Progress" subtitle="Recycler badge is 80% complete" tag="2 Left" tagColor={config.accent} accent={config.accent} onPress={() => openPage("badgesOverview")} />
    </View>

    <SectionHeader title="Nearby Campaigns" actionText="Explore" onPress={() => openPage("nearbyCampaigns")} />
    <View style={styles.listWrapper}>
      <ListItem icon="beach" title="City Beach Cleanup" subtitle="Saturday, 08:00 AM" tag="500 Pts" tagColor={config.accent} accent={config.accent} onPress={() => openPage("campaignBeachCleanup")} />
      <ListItem icon="map-marker-radius-outline" title="Nearby Drives" subtitle="See more clean-up drives around you" tag="12 Open" tagColor="#0EA5E9" accent={config.accent} onPress={() => openPage("nearbyCampaigns")} />
    </View>

    <SectionHeader title="Recent Reports Status" actionText="See All" onPress={() => openPage("recentReportsStatus")} />
    <View style={styles.listWrapper}>
      <ListItem icon="progress-clock" title="Market Road Overflow" subtitle="Pending champion verification" tag="Pending" tagColor="#F59E0B" accent={config.accent} onPress={() => openPage("recentReportsStatus")} />
      <ListItem icon="check-decagram" title="Lake Road Dumping" subtitle="Assigned to worker team" tag="In Progress" tagColor="#0EA5E9" accent={config.accent} onPress={() => openPage("reportHistory")} />
    </View>

    <SectionHeader title="Quick Report Waste CTA" />
    <View style={styles.actionGrid}>
      <ActionCard icon="camera-plus" title="Report Waste" subtitle="Launch the full citizen report flow" color={config.accent} onPress={() => openPage("reportWaste")} />
      <ActionCard icon="book-open-page-variant" title="Eco Tips" subtitle="Learn quick reporting and segregation tips" color="#0EA5E9" onPress={() => openPage("ecoTips")} />
    </View>
  </>
);

const NgoDashboard = ({ config, openPage }: { config: any; openPage: (pageId: AppPageId) => void }) => (
  <>
    <MeshHeroCard config={config} icon="earth" label="NGO Dashboard" value="1,240 kg" stat1Value="12" stat1Label="Active Campaigns" stat2Value="340" stat2Label="Volunteers" />

    <SectionHeader title="Active Campaigns" actionText="Manage All" onPress={() => openPage("ngoCampaignHistory")} />
    <View style={styles.listWrapper}>
      <ListItem icon="beach" title="City Beach Cleanup" subtitle="Tomorrow, 08:00 AM" tag="Active" tagColor={config.accent} accent={config.accent} onPress={() => openPage("campaignBeachCleanup")} />
      <ListItem icon="pine-tree" title="Sector 4 Park Restoration" subtitle="Sunday, 09:00 AM" tag="Planning" tagColor="#0EA5E9" accent={config.accent} onPress={() => openPage("campaignParkRestoration")} />
    </View>

    <SectionHeader title="Volunteer & Impact" actionText="Insights" onPress={() => openPage("contributionInsights")} />
    <View style={styles.listWrapper}>
      <ListItem icon="account-group-outline" title="Volunteer Stats" subtitle="340 active volunteers, 84 avg turnout" tag="+18 New" tagColor="#00D65B" accent={config.accent} onPress={() => openPage("volunteerDiscovery")} />
      <ListItem icon="chart-line" title="Impact Numbers" subtitle="12.4 tons diverted across 21 campaigns" tag="+2.1 t" tagColor="#8B5CF6" accent={config.accent} onPress={() => openPage("impactMilestones")} />
    </View>

    <SectionHeader title="Pending Reviews" actionText="Open Queue" onPress={() => openPage("volunteerSubmissions")} />
    <View style={styles.listWrapper}>
      <ListItem icon="clipboard-check-multiple-outline" title="Volunteer Proof Reviews" subtitle="14 pending volunteer submissions" tag="Pending" tagColor="#F59E0B" accent={config.accent} onPress={() => openPage("volunteerSubmissions")} />
      <ListItem icon="star-circle-outline" title="Campaign Rewards Summary" subtitle="Review issued and pending campaign rewards" tag="50k Budget" tagColor={config.accent} accent={config.accent} onPress={() => openPage("campaignRewardsSummary")} />
    </View>
  </>
);

const WorkerDashboard = ({ config, openPage }: { config: any; openPage: (pageId: AppPageId) => void }) => (
  <>
    <MeshHeroCard config={config} icon="truck-check" label="Today's Assigned Tasks" value="5 Tasks" stat1Value="2" stat1Label="High Priority" stat2Value="12" stat2Label="Closed This Week" />

    <SectionHeader title="Next Task Priority" actionText="Open Flow" onPress={() => openPage("closeActiveTask")} />
    <View style={styles.listWrapper}>
      <ListItem icon="alert-circle" title="Clear Sector 4 Park" subtitle="Verified public complaint with 2-hour SLA" tag="High" tagColor="#F43F5E" accent={config.accent} onPress={() => openPage("clearSector4Park")} />
      <ListItem icon="clipboard-check-outline" title="Quick Close Task" subtitle="Upload before and after proof for the active assignment" tag="Proof" tagColor={config.accent} accent={config.accent} onPress={() => openPage("closeActiveTask")} />
    </View>

    <SectionHeader title="Route Snapshot" actionText="View Route" onPress={() => openPage("viewRoute")} />
    <View style={styles.listWrapper}>
      <ListItem icon="map-marker-path" title="Assigned Route" subtitle="Zone B, Market Road, and Sector 4 coverage for this shift" tag="12 Stops" tagColor="#0EA5E9" accent={config.accent} onPress={() => openPage("viewRoute")} />
      <ListItem icon="map-marker-radius-outline" title="Assigned Zone" subtitle="Check area-wise work split and stop sequence" tag="Zone B" tagColor="#64748B" accent={config.accent} onPress={() => openPage("assignedZone")} />
    </View>

    <SectionHeader title="Completion Stats" actionText="Details" onPress={() => openPage("workerCompletionStats")} />
    <View style={styles.listWrapper}>
      <ListItem icon="chart-bar" title="Daily / Weekly Stats" subtitle="12 tasks closed today and 47 completed this week" tag="96% On Time" tagColor="#00D65B" accent={config.accent} onPress={() => openPage("workerCompletionStats")} />
      <ListItem icon="speedometer" title="Performance Score" subtitle="Track quality, turnaround speed, and consistency" tag="92 Score" tagColor="#8B5CF6" accent={config.accent} onPress={() => openPage("performanceScore")} />
    </View>
  </>
);

const ChampionDashboard = ({ config, openPage }: { config: any; openPage: (pageId: AppPageId) => void }) => (
  <>
    <MeshHeroCard config={config} icon="shield-star" label="Pending Verifications Count" value="18 Reports" stat1Value="4" stat1Label="Urgent Reports" stat2Value="96%" stat2Label="Accuracy Score" />

    <SectionHeader title="Urgent Reports" actionText="Open Queue" onPress={() => openPage("verifyReports")} />
    <View style={styles.listWrapper}>
      <ListItem icon="alert-circle-outline" title="Overflow bin near Market Road" subtitle="Needs quick proof check and assignment decision" tag="Urgent" tagColor="#F43F5E" accent={config.accent} onPress={() => openPage("verificationQueue")} />
      <ListItem icon="flag-outline" title="Community Escalations" subtitle="Review flagged items that may need higher-level action" tag="4 Open" tagColor="#8B5CF6" accent={config.accent} onPress={() => openPage("communityEscalations")} />
    </View>

    <SectionHeader title="Area-wise Moderation Stats" actionText="View Stats" onPress={() => openPage("communityTrustMetrics")} />
    <View style={styles.listWrapper}>
      <ListItem icon="chart-box-outline" title="Approval Patterns by Area" subtitle="Ward 4 leads on fast approvals and low reversals" tag="4.9 Trust" tagColor="#0EA5E9" accent={config.accent} onPress={() => openPage("communityTrustMetrics")} />
      <ListItem icon="history" title="Recent Approved Reports" subtitle="Check the latest reports sent forward after moderation" tag="11 Today" tagColor="#00D65B" accent={config.accent} onPress={() => openPage("recentApprovedReports")} />
    </View>

    <SectionHeader title="Quick Verification CTA" />
    <View style={styles.actionGrid}>
      <ActionCard icon="check-decagram" title="Open Verification Queue" subtitle="Review proof, approve, reject, or escalate" color={config.accent} onPress={() => openPage("verifyReports")} />
      <ActionCard icon="timeline-alert-outline" title="Rejected Reports" subtitle="Audit recent moderation rejections" color="#F43F5E" onPress={() => openPage("rejectedReports")} />
    </View>
  </>
);

const AuthorityDashboard = ({ config, openPage }: { config: any; openPage: (pageId: AppPageId) => void }) => (
  <>
    <MeshHeroCard config={config} icon="office-building" label="City Segregation Rate" value="68.5%" stat1Value="24h" stat1Label="Avg Resolution Time" stat2Value="8" stat2Label="Active NGOs" />

    <SectionHeader title="Operations" />
    <View style={styles.actionGrid}>
      <ActionCard icon="file-document-check" title="NGO Approvals" subtitle="Review applications" color={config.accent} onPress={() => openPage("ngoApprovals")} />
      <ActionCard icon="gavel" title="Penalties" subtitle="Manage defaulters & fines" color="#F43F5E" onPress={() => openPage("issuePenalty")} />
    </View>
  </>
);

export function HomeScreen() {
  const activeRole = useAppStore((state) => state.activeRole);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
          <Text style={styles.greeting}>Good morning, Hero</Text>
          <View style={styles.roleBadgeContainer}>
            <View style={[styles.roleBadgeDot, { backgroundColor: currentConfig.accent }]} />
            <Text style={styles.roleBadgeText}>{roleLabels[activeRole]}</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <AnimatedPressable style={styles.iconBtn} onPress={() => openPage("notifications")}>
            <Feather name="bell" size={20} color="#0F172A" />
            <View style={[styles.notificationDot, { backgroundColor: "#F43F5E" }]} />
          </AnimatedPressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeRole === "citizen" && <CitizenDashboard config={currentConfig} openPage={openPage} />}
        {activeRole === "ngo" && <NgoDashboard config={currentConfig} openPage={openPage} />}
        {activeRole === "worker" && <WorkerDashboard config={currentConfig} openPage={openPage} />}
        {activeRole === "champion" && <ChampionDashboard config={currentConfig} openPage={openPage} />}
        {activeRole === "authority" && <AuthorityDashboard config={currentConfig} openPage={openPage} />}

        <View style={{ height: 120 }} />
      </ScrollView>
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#F8FAFC",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 12 : 24,
    paddingBottom: 20,
    backgroundColor: "#F8FAFC",
  },
  headerTextWrap: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  roleBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignSelf: "flex-start",
  },
  roleBadgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  heroCardWrapper: {
    marginBottom: 32,
  },
  heroCard: {
    borderRadius: 32,
    backgroundColor: "#0B1120",
    padding: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },
  heroGlow1: {
    position: "absolute",
    top: -40,
    right: -20,
    width: 150,
    height: 150,
    borderRadius: 75,
    opacity: 0.15,
  },
  heroGlow2: {
    position: "absolute",
    bottom: -60,
    left: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.1,
  },
  heroBgIcon: {
    position: "absolute",
    right: -20,
    bottom: -20,
    opacity: 0.03,
    transform: [{ rotate: "-15deg" }],
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  heroLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  heroIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroValue: {
    fontSize: 48,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -1.5,
  },
  heroDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 20,
  },
  heroStatsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  heroStatItem: {
    flex: 1,
  },
  heroStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 20,
  },
  heroStatValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  heroStatLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  sectionActionPill: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  sectionActionText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#64748B",
  },
  actionGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 36,
  },
  actionCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  actionCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 16,
  },
  listWrapper: {
    gap: 12,
    marginBottom: 36,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  listColorStripe: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  listIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    marginLeft: 4,
  },
  listTextContent: {
    flex: 1,
    marginRight: 12,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  listSubtitle: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  listTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  listTagText: {
    fontSize: 12,
    fontWeight: "800",
  },
});
