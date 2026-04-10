//src/screens/scrapper/ScrapFeedScreen.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ScreenSafeArea } from "../../components/ui/ScreenSafeArea";
import { ScrapListing, scrapService } from "../../services/scrapService";

export function ScrapFeedScreen() {
  const [searchCity, setSearchCity] = useState("Vadodara"); // Default city for testing
  const [listings, setListings] = useState<ScrapListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Bidding Modal State
  const [selectedListing, setSelectedListing] = useState<ScrapListing | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [proposedTime, setProposedTime] = useState("");
  const [isBidding, setIsBidding] = useState(false);

  const fetchListings = async () => {
    try {
      const data = await scrapService.getFeed(searchCity);
      setListings(data);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [searchCity]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchListings();
  };

  const handleOpenBid = (listing: ScrapListing) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedListing(listing);
    setBidAmount("");
    setProposedTime("");
  };

  const handleSubmitBid = async () => {
    if (!selectedListing || !bidAmount || !proposedTime) {
      Alert.alert("Missing Info", "Please provide a bid amount and pickup time.");
      return;
    }

    setIsBidding(true);
    try {
      await scrapService.submitBid(selectedListing.id, Number(bidAmount), proposedTime);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Bid Placed! 🚀", "The citizen will be notified of your offer.");
      setSelectedListing(null); // Close the modal
    } catch (error: any) {
      Alert.alert("Error", error.message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsBidding(false);
    }
  };

  const renderListing = ({ item }: { item: ScrapListing }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Open</Text>
          </View>
        </View>
        
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description || "No description provided."}
        </Text>
        
        <View style={styles.cardMeta}>
          <View style={styles.metaRow}>
            <MaterialCommunityIcons name="map-marker-outline" size={16} color="#64748B" />
            <Text style={styles.metaText}>{item.city}</Text>
          </View>
          <View style={styles.metaRow}>
            <MaterialCommunityIcons name="account-outline" size={16} color="#64748B" />
            <Text style={styles.metaText}>{item.citizenFirstName} {item.citizenLastName}</Text>
          </View>
        </View>

        <Pressable 
          style={({ pressed }) => [styles.bidBtn, pressed && { opacity: 0.8 }]}
          onPress={() => handleOpenBid(item)}
        >
          <Text style={styles.bidBtnText}>Place a Bid</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <ScreenSafeArea style={styles.container}>
      {/* Header & City Filter */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marketplace</Text>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={24} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search city..."
            value={searchCity}
            onChangeText={setSearchCity}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Feed List */}
      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#14B8A6" />
        </View>
      ) : listings.length === 0 ? (
        <View style={styles.centerBox}>
          <MaterialCommunityIcons name="package-variant-closed" size={60} color="#E2E8F0" />
          <Text style={styles.emptyText}>No scrap available in {searchCity} right now.</Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderListing}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#14B8A6" />}
        />
      )}

      {/* BIDDING BOTTOM SHEET MODAL */}
      <Modal visible={!!selectedListing} transparent animationType="slide" onRequestClose={() => setSelectedListing(null)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setSelectedListing(null)} />
          
          <View style={styles.sheetContent}>
            <View style={styles.dragIndicator} />
            <Text style={styles.sheetTitle}>Offer on {selectedListing?.title}</Text>
            
            <Text style={styles.label}>Your Bid Amount (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 500"
              keyboardType="numeric"
              value={bidAmount}
              onChangeText={setBidAmount}
            />

            <Text style={styles.label}>Proposed Pickup Time</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Tomorrow at 4:00 PM"
              value={proposedTime}
              onChangeText={setProposedTime}
            />

            <Pressable 
              style={({ pressed }) => [styles.submitBidBtn, isBidding && { opacity: 0.7 }, pressed && { transform: [{ scale: 0.98 }] }]}
              onPress={handleSubmitBid}
              disabled={isBidding}
            >
              {isBidding ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.submitBidBtnText}>Send Offer</Text>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { padding: 20, backgroundColor: "#FFF", borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  headerTitle: { fontSize: 28, fontWeight: "800", color: "#0F172A", marginBottom: 12 },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8FAFC", borderRadius: 12, paddingHorizontal: 16, height: 48, borderWidth: 1, borderColor: "#E2E8F0" },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: "#0F172A" },
  listContent: { padding: 20, gap: 16 },
  card: { backgroundColor: "#FFF", borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: "#E2E8F0", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cardImage: { width: "100%", height: 180, backgroundColor: "#F1F5F9" },
  cardContent: { padding: 16 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#0F172A", flex: 1, marginRight: 10 },
  badge: { backgroundColor: "#ECFDF5", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: "#10B981", fontSize: 12, fontWeight: "700" },
  cardDescription: { fontSize: 14, color: "#64748B", marginBottom: 16, lineHeight: 20 },
  cardMeta: { flexDirection: "row", gap: 16, marginBottom: 16 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 13, color: "#64748B", fontWeight: "500" },
  bidBtn: { backgroundColor: "#14B8A6", paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  bidBtnText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
  centerBox: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyText: { color: "#64748B", fontSize: 16, textAlign: "center", marginTop: 16 },
  
  /* Modal Styles */
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(15, 23, 42, 0.4)" },
  sheetContent: { backgroundColor: "#FFF", borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: Platform.OS === "ios" ? 40 : 24 },
  dragIndicator: { width: 40, height: 5, borderRadius: 3, backgroundColor: "#E2E8F0", alignSelf: "center", marginBottom: 20 },
  sheetTitle: { fontSize: 20, fontWeight: "800", color: "#0F172A", marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "700", color: "#334155", marginBottom: 8 },
  input: { backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, padding: 16, fontSize: 16, color: "#0F172A", marginBottom: 20 },
  submitBidBtn: { backgroundColor: "#14B8A6", height: 56, borderRadius: 16, justifyContent: "center", alignItems: "center", marginTop: 10 },
  submitBidBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});