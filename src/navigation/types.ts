import type { NavigatorScreenParams } from "@react-navigation/native";
import type { AppPageId } from "./pageRegistry";

export type RootStackParamList = {
  Welcome: undefined;
  RoleSelection: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Page: { pageId: AppPageId };
};

export type MainTabParamList = {
  Home: undefined;
  Explore: undefined;
  Action: undefined;
  Rewards: undefined;
  Profile: undefined;
};
