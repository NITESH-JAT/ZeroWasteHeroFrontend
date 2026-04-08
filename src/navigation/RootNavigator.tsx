// src/navigation/RootNavigator.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RoleSelectionScreen } from "../screens/auth/RoleSelectionScreen";
import { WelcomeScreen } from "../screens/auth/WelcomeScreen";
import { DetailScreen } from "../screens/details/DetailScreen";
import { useAppStore } from "../store/useAppStore";
import { RoleTabs } from "./RoleTabs";
import { RootStackParamList } from "./types";
import { PostScrapScreen } from '../screens/citizen/PostScrapScreen';
import { ManageBidsScreen } from '../screens/citizen/ManageBidsScreen';
import { ScrapDetailsScreen } from "../screens/scrapper/ScrapDetailsScreen";
import { ReportWasteScreen } from "../screens/citizen/ReportWasteScreen";
import { VerifyReportsScreen } from "../screens/champion/VerifyReportsScreen";
import { WorkerTaskScreen } from "../screens/worker/WorkerTaskScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  // FIX: We are now checking the correct variable from your Zustand store!
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      {/* If NOT authenticated, ONLY show these screens */}
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        </>
      ) : (
        /* If Authenticated, show the app ecosystem */
        <>
          <Stack.Screen name="MainTabs" component={RoleTabs} />
          <Stack.Screen name="Page" component={DetailScreen} />
          <Stack.Screen 
            name="PostScrap" 
            component={PostScrapScreen} 
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen 
            name="ManageBids" 
            component={ManageBidsScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="ScrapDetails" 
            component={ScrapDetailsScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="ReportWaste" 
            component={ReportWasteScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen 
            name="VerifyReports" 
            component={VerifyReportsScreen} 
          />
          <Stack.Screen 
            name="WorkerTask" 
            component={WorkerTaskScreen} 
          />
        </>
      )}
    </Stack.Navigator>
  );
}