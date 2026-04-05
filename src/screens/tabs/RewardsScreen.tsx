import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenSafeArea } from "../../components/ui/ScreenSafeArea";
import type { AppPageId } from "../../navigation/pageRegistry";
import type { RootStackParamList } from "../../navigation/types";
import { useAppStore } from "../../store/useAppStore";

const { width } = Dimensions.get("window");

const roleConfig = {
  citizen: { accent: "#00E676", icon: "leaf-circle", currency: "GreenPoints" },
  ngo: { accent: "#0EA5E9", icon: "hand-coin", currency: "Campaign Budget" },
  worker: { accent: "#F59E0B", icon: "medal", currency: "Earned Points" },
  champion: { accent: "#8B5CF6", icon: "star-circle", currency: "Community Pool" },
  authority: { accent: "#F43F5E", icon: "bank", currency: "CSR Funding" },
};

const SectionHeader = ({ title, actionText, onPress }: any) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {actionText && (
      <Pressable
        style={({ pressed }) => [styles.sectionActionPill, pressed && { opacity: 0.7 }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          if (onPress) onPress();
        }}
      >
        <Text style={styles.sectionActionText}>{actionText}</Text>
      </Pressable>
    )}
  </View>
);

function RewardItemCard({ icon, title, description, points, color, onPress }: any) {
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  return (
    <Pressable
      style={({ pressed }) => [styles.rewardCard, pressed && !isButtonPressed && styles.rewardCardPressed]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (onPress) onPress();
      }}
    >
      <View style={styles.rewardHeader}>
        <View style={[styles.rewardIconBox, { backgroundColor: `${color}15` }]}>
          <MaterialCommunityIcons name={icon} size={32} color={color} />
        </View>
        <View style={styles.pointsPill}>
          <Text style={[styles.pointsPillText, { color }]}>{points} Pts</Text>
        </View>
      </View>
      <Text style={styles.rewardTitle}>{title}</Text>
      <Text style={styles.rewardSubtitle}>{description}</Text>
      <Pressable
        style={({ pressed }) => [styles.redeemBtn, pressed && styles.redeemBtnPressed]}
        onPressIn={() => setIsButtonPressed(true)}
        onPressOut={() => setIsButtonPressed(false)}
        onPress={(event) => {
          event.stopPropagation();
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          if (onPress) onPress();
        }}
      >
        <Text style={styles.redeemBtnText}>Redeem</Text>
      </Pressable>
    </Pressable>
  );
}

const BadgeCard = ({ icon, title, color, onPress }: any) => (
  <Pressable
    style={({ pressed }) => [styles.badgeCard, pressed && { transform: [{ scale: 0.95 }] }]}
    onPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (onPress) onPress();
    }}
  >
    <View style={[styles.badgeIconWrap, { borderColor: color }]}>
      <MaterialCommunityIcons name={icon} size={36} color={color} />
    </View>
    <Text style={styles.badgeTitle}>{title}</Text>
  </Pressable>
);

const ActionListItem = ({ icon, title, subtitle, color, onPress }: any) => (
  <Pressable
    style={({ pressed }) => [styles.actionListItem, pressed && { backgroundColor: "#F8FAFC", transform: [{ scale: 0.98 }] }]}
    onPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (onPress) onPress();
    }}
  >
    <View style={[styles.actionListIcon, { backgroundColor: `${color}15` }]}>
      <MaterialCommunityIcons name={icon} size={24} color={color} />
    </View>
    <View style={styles.actionListContent}>
      <Text style={styles.actionListTitle}>{title}</Text>
      <Text style={styles.actionListSubtitle}>{subtitle}</Text>
    </View>
    <MaterialCommunityIcons name="chevron-right" size={20} color="#CBD5E1" />
  </Pressable>
);

const MeshWalletCard = ({ config, balance, subtext, onHistoryPress }: any) => (
  <View style={styles.walletWrapper}>
    <View style={styles.walletCard}>
      <View style={[styles.walletGlow1, { backgroundColor: config.accent }]} />
      <View style={[styles.walletGlow2, { backgroundColor: config.accent }]} />
      <MaterialCommunityIcons name={config.icon} size={160} color="#FFFFFF" style={styles.walletBgIcon} />

      <View style={styles.walletContent}>
        <View style={styles.walletTopRow}>
          <Text style={styles.walletLabel}>{config.currency}</Text>
          <View style={styles.walletIconWrapper}>
            <MaterialCommunityIcons name="wallet-outline" size={18} color={config.accent} />
          </View>
        </View>

        <Text style={styles.walletBalance}>{balance}</Text>

        <View style={styles.walletFooter}>
          <Text style={styles.walletSubtext}>{subtext}</Text>
          <Pressable
            style={({ pressed }) => [styles.historyBtn, pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              if (onHistoryPress) onHistoryPress();
            }}
          >
            <Text style={styles.historyBtnText}>History</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </View>
);

const CitizenRewards = ({ config, openPage }: { config: any; openPage: (pageId: AppPageId) => void }) => (
  <>
    <MeshWalletCard config={config} balance="3,250" subtext="Equivalent to Rs325 in value" onHistoryPress={() => openPage("rewardHistory")} />

    <SectionHeader title="My Badges" />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
      <BadgeCard icon="shield-star" title="Guardian" color="#F59E0B" onPress={() => openPage("badgesOverview")} />
      <BadgeCard icon="recycle" title="Recycler" color={config.accent} onPress={() => openPage("badgesOverview")} />
      <BadgeCard icon="fire" title="7-Day Streak" color="#F43F5E" onPress={() => openPage("badgesOverview")} />
    </ScrollView>

    <SectionHeader title="Marketplace" actionText="View All" onPress={() => openPage("rewardsMarketplace")} />
    <View style={styles.grid}>
      <RewardItemCard icon="ticket-percent" title="Movie Voucher" description="Rs150 off at PVR Cinemas" points="1500" color="#0EA5E9" onPress={() => openPage("movieVoucher")} />
      <RewardItemCard icon="flower" title="Compost Kit" description="Home composting starter kit" points="2000" color={config.accent} onPress={() => openPage("compostKit")} />
      <RewardItemCard icon="bus" title="Transit Pass" description="Free day pass for city bus" points="800" color="#8B5CF6" onPress={() => openPage("transitPass")} />
      <RewardItemCard icon="shopping" title="Grocery Coupon" description="10% off at local stores" points="1000" color="#F59E0B" onPress={() => openPage("groceryCoupon")} />
    </View>

    <SectionHeader title="Streak Bonuses" actionText="Details" onPress={() => openPage("streakBonuses")} />
    <View style={styles.actionList}>
      <ActionListItem icon="fire" title="7-Day Streak Bonus" subtitle="Keep your daily activity active to unlock the next payout" color="#8B5CF6" onPress={() => openPage("streakBonuses")} />
    </View>
  </>
);

const WorkerRewards = ({ config, openPage }: { config: any; openPage: (pageId: AppPageId) => void }) => (
  <>
    <MeshWalletCard config={config} balance="1,800" subtext="Performance-linked earnings and incentives" onHistoryPress={() => openPage("incentiveSummary")} />

    <SectionHeader title="Recognition Badges" />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
      <BadgeCard icon="medal-outline" title="Fast Closer" color="#F59E0B" onPress={() => openPage("badgesOverview")} />
      <BadgeCard icon="shield-check-outline" title="Safe Worker" color="#0EA5E9" onPress={() => openPage("badgesOverview")} />
      <BadgeCard icon="check-decagram-outline" title="Quality Proof" color="#00D65B" onPress={() => openPage("badgesOverview")} />
    </ScrollView>

    <SectionHeader title="Performance & Completion" actionText="Open" onPress={() => openPage("performanceScore")} />
    <View style={styles.actionList}>
      <ActionListItem icon="speedometer" title="Performance Score" subtitle="Overall score from task speed, proof quality, and consistency" color="#8B5CF6" onPress={() => openPage("performanceScore")} />
      <ActionListItem icon="chart-bar" title="Daily / Weekly Completion Stats" subtitle="Review today and weekly completion totals" color="#0EA5E9" onPress={() => openPage("workerCompletionStats")} />
    </View>

    <SectionHeader title="Incentive Summary" actionText="Details" onPress={() => openPage("incentiveSummary")} />
    <View style={styles.actionList}>
      <ActionListItem icon="cash-multiple" title="Incentive Summary" subtitle="See earned points, pending payouts, and quality bonuses" color={config.accent} onPress={() => openPage("incentiveSummary")} />
    </View>
  </>
);
const NgoRewards = ({ config, openPage }: { config: any; openPage: (pageId: AppPageId) => void }) => (
  <>
    <MeshWalletCard config={config} balance="50,000" subtext="Allocated budget for campaigns" onHistoryPress={() => openPage("campaignRewardsSummary")} />

    <SectionHeader title="NGO Recognition Badges" actionText="View" onPress={() => openPage("ngoRecognition")} />
    <View style={styles.actionList}>
      <ActionListItem icon="certificate-outline" title="NGO Recognition" subtitle="View your platinum partner badge" color="#F59E0B" onPress={() => openPage("ngoRecognition")} />
    </View>

    <SectionHeader title="Impact & Contribution" actionText="Insights" onPress={() => openPage("contributionInsights")} />
    <View style={styles.actionList}>
      <ActionListItem icon="flag-checkered" title="Impact Milestones" subtitle="Track major organization milestones" color="#00D65B" onPress={() => openPage("impactMilestones")} />
      <ActionListItem icon="chart-donut" title="Contribution Insights" subtitle="See volunteer and partner contribution trends" color="#8B5CF6" onPress={() => openPage("contributionInsights")} />
    </View>

    <SectionHeader title="Campaign Rewards Summary" actionText="Open" onPress={() => openPage("campaignRewardsSummary")} />
    <View style={styles.actionList}>
      <ActionListItem icon="hand-coin-outline" title="Allocate Campaign Rewards" subtitle="Set points per volunteer" color={config.accent} onPress={() => openPage("allocateCampaignRewards")} />
      <ActionListItem icon="gift-outline" title="Campaign Rewards Summary" subtitle="Review budget allocation and issued points" color={config.accent} onPress={() => openPage("campaignRewardsSummary")} />
    </View>
  </>
);
const ChampionRewards = ({ config, openPage }: { config: any; openPage: (pageId: AppPageId) => void }) => (
  <>
    <MeshWalletCard config={config} balance="10,000" subtext="Monthly bonus pool for Ward 15" onHistoryPress={() => openPage("rewardHistory")} />
    <SectionHeader title="Community Allocation" />
    <View style={styles.actionList}>
      <ActionListItem icon="medal-outline" title="Award Bonus Points" subtitle="Distribute to top performing blocks" color={config.accent} onPress={() => openPage("awardBonusPoints")} />
      <ActionListItem icon="history" title="Distribution Logs" subtitle="View past allocations" color="#0F172A" onPress={() => openPage("distributionLogs")} />
    </View>
  </>
);

const AuthorityRewards = ({ config, openPage }: { config: any; openPage: (pageId: AppPageId) => void }) => (
  <>
    <MeshWalletCard config={config} balance="Rs2.5M" subtext="Total CSR & Sponsorship Funding" onHistoryPress={() => openPage("rewardHistory")} />
    <SectionHeader title="Ecosystem Funding" />
    <View style={styles.actionList}>
      <ActionListItem icon="handshake-outline" title="Partner Management" subtitle="Manage corporate sponsors" color={config.accent} onPress={() => openPage("partnerManagement")} />
      <ActionListItem icon="bank-transfer" title="Fund Allocation" subtitle="Distribute budgets to NGOs" color="#0EA5E9" onPress={() => openPage("fundAllocation")} />
    </View>
  </>
);

export function RewardsScreen() {
  const activeRole = useAppStore((state) => state.activeRole);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (!activeRole) {
    return (
      <ScreenSafeArea style={styles.safeArea}>
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="account-question-outline" size={56} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>No Persona Selected</Text>
        </View>
      </ScreenSafeArea>
    );
  }

  const currentConfig = roleConfig[activeRole as keyof typeof roleConfig];
  const openPage = (pageId: AppPageId) => navigation.navigate("Page", { pageId });

  return (
    <ScreenSafeArea style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.bgBlobGreen} />
        <View style={styles.bgBlobBlue} />

        <View style={styles.header}>
          <Text style={styles.title}>Rewards</Text>
          <Text style={styles.subtitle}>Manage your ecosystem incentives.</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {activeRole === "citizen" && <CitizenRewards config={currentConfig} openPage={openPage} />}
          {activeRole === "worker" && <WorkerRewards config={currentConfig} openPage={openPage} />}
          {activeRole === "ngo" && <NgoRewards config={currentConfig} openPage={openPage} />}
          {activeRole === "champion" && <ChampionRewards config={currentConfig} openPage={openPage} />}
          {activeRole === "authority" && <AuthorityRewards config={currentConfig} openPage={openPage} />}

          <View style={{ height: 140 }} />
        </ScrollView>
      </View>
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#F8FAFC" },
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: "#0F172A", marginTop: 16 },
  bgBlobGreen: { position: "absolute", top: "10%", left: -60, width: width * 0.8, height: width * 0.8, borderRadius: width * 0.4, backgroundColor: "#00D65B", opacity: 0.04 },
  bgBlobBlue: { position: "absolute", bottom: "30%", right: -80, width: width * 0.9, height: width * 0.9, borderRadius: width * 0.45, backgroundColor: "#0EA5E9", opacity: 0.03 },
  header: { paddingHorizontal: 24, paddingTop: Platform.OS === "ios" ? 12 : 24, paddingBottom: 16 },
  title: { fontSize: 34, fontWeight: "800", color: "#0F172A", letterSpacing: -1, marginBottom: 6 },
  subtitle: { fontSize: 15, fontWeight: "500", color: "#64748B" },
  scrollContent: { paddingHorizontal: 24, paddingTop: 8 },
  walletWrapper: { marginBottom: 32 },
  walletCard: {
    borderRadius: 32,
    backgroundColor: "#0B1120",
    padding: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  walletGlow1: { position: "absolute", top: -60, right: -20, width: 200, height: 200, borderRadius: 100, opacity: 0.15 },
  walletGlow2: { position: "absolute", bottom: -80, left: -40, width: 240, height: 240, borderRadius: 120, opacity: 0.1 },
  walletBgIcon: { position: "absolute", right: -30, bottom: -30, opacity: 0.04, transform: [{ rotate: "-15deg" }] },
  walletContent: { position: "relative", zIndex: 2 },
  walletTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  walletLabel: { fontSize: 14, fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.8 },
  walletIconWrapper: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.1)", justifyContent: "center", alignItems: "center" },
  walletBalance: { fontSize: 52, fontWeight: "800", color: "#FFFFFF", letterSpacing: -2, marginBottom: 24 },
  walletFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.1)", paddingTop: 20 },
  walletSubtext: { fontSize: 13, color: "#94A3B8", fontWeight: "500" },
  historyBtn: { backgroundColor: "rgba(255,255,255,0.1)", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  historyBtnText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: "#0F172A", letterSpacing: -0.5 },
  sectionActionPill: { backgroundColor: "#F1F5F9", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12 },
  sectionActionText: { fontSize: 13, fontWeight: "800", color: "#64748B" },
  horizontalScroll: { paddingBottom: 32, gap: 16 },
  badgeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    width: 110,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  badgeIconWrap: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, justifyContent: "center", alignItems: "center", marginBottom: 12, backgroundColor: "#F8FAFC" },
  badgeTitle: { fontSize: 13, fontWeight: "700", color: "#0F172A", textAlign: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 16, justifyContent: "space-between" },
  rewardCard: {
    width: (width - 48 - 16) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  rewardCardPressed: { transform: [{ scale: 0.96 }] },
  rewardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  rewardIconBox: { width: 48, height: 48, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  pointsPill: { backgroundColor: "#F8FAFC", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: "#E2E8F0" },
  pointsPillText: { fontSize: 11, fontWeight: "800" },
  rewardTitle: { fontSize: 15, fontWeight: "800", color: "#0F172A", marginBottom: 4 },
  rewardSubtitle: { fontSize: 12, color: "#64748B", lineHeight: 16, marginBottom: 16, minHeight: 32 },
  redeemBtn: { backgroundColor: "#0F172A", paddingVertical: 10, borderRadius: 14, alignItems: "center" },
  redeemBtnPressed: { opacity: 0.9, transform: [{ scale: 0.97 }] },
  redeemBtnText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  actionList: { gap: 12 },
  actionListItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  actionListIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: "center", alignItems: "center", marginRight: 16 },
  actionListContent: { flex: 1, marginRight: 12 },
  actionListTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A", marginBottom: 4 },
  actionListSubtitle: { fontSize: 13, color: "#64748B", fontWeight: "500" },
});




