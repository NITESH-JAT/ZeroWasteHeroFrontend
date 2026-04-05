import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RoleSelectionScreen } from "../screens/auth/RoleSelectionScreen";
import { WelcomeScreen } from "../screens/auth/WelcomeScreen";
import { DetailScreen } from "../screens/details/DetailScreen";
import { useAppStore } from "../store/useAppStore";
import { RoleTabs } from "./RoleTabs";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const authState = useAppStore((state) => state.authState);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {authState === "welcome" ? (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={RoleTabs} />
          <Stack.Screen name="Page" component={DetailScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
