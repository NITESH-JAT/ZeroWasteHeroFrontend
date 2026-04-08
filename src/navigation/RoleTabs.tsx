import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomTabBarButtonProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";

// Screen Imports
import { ActionScreen } from "../screens/tabs/ActionScreen";
import { ExploreScreen } from "../screens/tabs/ExploreScreen";
import { HomeScreen } from "../screens/tabs/HomeScreen";
import { ProfileScreen } from "../screens/tabs/ProfileScreen";
import { RewardsScreen } from "../screens/tabs/RewardsScreen";
import { ScrapFeedScreen } from "../screens/scrapper/ScrapFeedScreen"; // <-- Added Scrapper Feed

// State Import
import { useAppStore } from "../store/useAppStore";
import { MainTabParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();

// --- CUSTOM CENTER "ACTION" BUTTON (FLOATING FAB) ---
const CustomActionTabBarButton = ({ children, onPress }: BottomTabBarButtonProps) => {
  const navigation = useNavigation<any>();
  const user = useAppStore((state) => state.user);
  const isCitizen = user?.role === "citizen";

  return (
    <Pressable
      style={styles.customActionWrapper}
      onPress={(e) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        if (isCitizen) {
          // If Citizen, intercept the tab press and open the Post Scrap modal!
          navigation.navigate("PostScrap");
        } else {
          // For other roles, proceed to the normal Action screen
          if (onPress) onPress(e);
        }
      }}
    >
      <View style={[styles.customActionButton, isCitizen && { shadowColor: "#00D65B" }]}>
        <MaterialCommunityIcons 
          name={isCitizen ? "plus" : "qrcode-scan"} 
          size={34} 
          color="#FFFFFF" 
        />
      </View>
    </Pressable>
  );
};

export function RoleTabs() {
  const user = useAppStore((state) => state.user);
  const isScrapper = user?.role === "scrapper";

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#00D65B", 
        tabBarInactiveTintColor: "#94A3B8", 
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "home" : "home-outline"}
              size={28} 
              color={color}
            />
          ),
        }}
        listeners={{
          tabPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        }}
      />
      
      {/* --- DYNAMIC EXPLORE / MARKETPLACE TAB --- */}
      <Tab.Screen
        name="Explore"
        component={isScrapper ? ScrapFeedScreen : ExploreScreen}
        options={{
          tabBarLabel: isScrapper ? "Marketplace" : "Explore",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? (isScrapper ? "storefront" : "compass") : (isScrapper ? "storefront-outline" : "compass-outline")}
              size={28}
              color={color}
            />
          ),
        }}
        listeners={{
          tabPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        }}
      />
      
      {/* --- CENTER ACTION TAB --- */}
      <Tab.Screen
        name="Action"
        component={ActionScreen} // This only renders for non-citizens now
        options={{
          tabBarLabel: () => null, 
          tabBarButton: (props) => <CustomActionTabBarButton {...props} />,
        }}
      />
      
      <Tab.Screen
        name="Rewards"
        component={RewardsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "gift" : "gift-outline"}
              size={28}
              color={color}
            />
          ),
        }}
        listeners={{
          tabPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "account" : "account-outline"}
              size={28}
              color={color}
            />
          ),
        }}
        listeners={{
          tabPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0,
    
    // 1. Snapped perfectly to the bottom and sides
    bottom: 0, 
    left: 0, 
    right: 0,
    
    // 2. Taller Navbar (Accounts for safe area internally)
    height: Platform.OS === "ios" ? 96 : 76, 
    
    // 3. Internal padding pushes icons up safely above the OS gesture bar
    paddingBottom: Platform.OS === "ios" ? 28 : 10, 
    paddingTop: 12,
    
    // 4. Only round the top corners for that connected dock look
    borderTopLeftRadius: 32, 
    borderTopRightRadius: 32, 

    // Deep premium shadow
    elevation: 20, 
    shadowColor: "#0F172A", 
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 4,
  },
  /* Custom Action Button Styles */
  customActionWrapper: {
    top: -28, // Perfect offset to break the top of the grounded navbar
    justifyContent: "center",
    alignItems: "center",
  },
  customActionButton: {
    width: 68, 
    height: 68,
    borderRadius: 34,
    backgroundColor: "#0F172A", 
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0F172A", 
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 4,
    borderColor: "#F8FAFC", // Halo effect to separate it from the white navbar
  },
});