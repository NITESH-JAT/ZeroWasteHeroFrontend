import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScreenSafeArea } from "../../components/ui/ScreenSafeArea";
import { RootStackParamList } from "../../navigation/types";
import { ScrapBid, scrapService } from "../../services/scrapService";

type Props = NativeStackScreenProps<RootStackParamList, "ManageBids">;

export function ManageBidsScreen({ route, navigation }: Props) {
  // Grab the params we passed from the previous screen
  const { listingId, listingTitle } = route.params;

  const [bids, setBids] = useState<ScrapBid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [acceptingBidId, setAcceptingBidId] = useState<number | null>(null);

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const data = await scrapService.getBidsForListing(listingId);
      setBids(data);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptBid = async (bidId: number) => {
    // 1. Ask for confirmation so they don't accidentally click it
    Alert.alert(
      "Accept Offer?",
      "Once you accept this bid, all other bids will be rejected and the listing will be closed.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Accept Offer", 
          style: "default",
          onPress: async () => {
            setAcceptingBidId(bidId);
            try {
              await scrapService.acceptBid(bidId, listingId);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert("Success!", "You have accepted the offer. The Scrapper will arrive at the proposed time.");
              navigation.goBack(); // Send them back to their dashboard
            } catch (error: any) {
              Alert.alert("Error", error.message);
              setAcceptingBidId(null);
            }
          }
        }
      ]
    );
  };

  const renderBid = ({ item }: { item: ScrapBid }) => (
    <View style={styles.bidCard}>
      <View style={styles.bidInfo}>
        <Text style={styles.amountText}>₹{item.amount}</Text>
        <Text style={styles.scrapperName}>
          {item.scrapperFirstName} {item.scrapperLastName}
        </Text>
        <View style={styles.timeRow}>
          <MaterialCommunityIcons name="clock-outline" size={16} color="#64748B" />
          <Text style={styles.timeText}>{item.proposedTime}</Text>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.acceptBtn,
          acceptingBidId === item.id && { opacity: 0.7 },
          pressed && { transform: [{ scale: 0.95 }] }
        ]}
        onPress={() => handleAcceptBid(item.id)}
        disabled={acceptingBidId !== null} // Disable buttons while one is processing
      >
        {acceptingBidId === item.id ? (
          <ActivityIndicator color="#FFF" size="small" />
        ) : (
          <Text style={styles.acceptBtnText}>Accept</Text>
        )}
      </Pressable>
    </View>
  );

  return (
    <ScreenSafeArea style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
        </Pressable>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Review Offers</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>{listingTitle}</Text>
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#00D65B" />
        </View>
      ) : bids.length === 0 ? (
        <View style={styles.centerBox}>
          <MaterialCommunityIcons name="tag-hidden" size={60} color="#E2E8F0" />
          <Text style={styles.emptyText}>No offers yet for this listing.</Text>
          <Text style={styles.emptySubText}>We'll notify you when a Scrapper makes a bid.</Text>
        </View>
      ) : (
        <FlatList
          data={bids}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderBid}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { flexDirection: "row", alignItems: "center", padding: 20, backgroundColor: "#FFF", borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#F1F5F9", justifyContent: "center", alignItems: "center", marginRight: 16 },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: "800", color: "#0F172A" },
  headerSubtitle: { fontSize: 14, color: "#64748B", marginTop: 2 },
  listContent: { padding: 20, gap: 16 },
  bidCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "#E2E8F0", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  bidInfo: { flex: 1, marginRight: 16 },
  amountText: { fontSize: 24, fontWeight: "800", color: "#10B981", marginBottom: 4 },
  scrapperName: { fontSize: 16, fontWeight: "600", color: "#0F172A", marginBottom: 6 },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  timeText: { fontSize: 14, color: "#64748B", fontWeight: "500" },
  acceptBtn: { backgroundColor: "#00D65B", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, justifyContent: "center", alignItems: "center", minWidth: 90 },
  acceptBtnText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
  centerBox: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyText: { color: "#0F172A", fontSize: 18, fontWeight: "700", textAlign: "center", marginTop: 16 },
  emptySubText: { color: "#64748B", fontSize: 14, textAlign: "center", marginTop: 8, lineHeight: 20 },
});