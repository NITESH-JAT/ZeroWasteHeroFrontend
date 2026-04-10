//src/navigation/types.ts
import type { NavigatorScreenParams } from "@react-navigation/native";
import type { AppPageId } from "./pageRegistry";
import { ScrapListing } from "../services/scrapService";

export type RootStackParamList = {
  Welcome: undefined;
  RoleSelection: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Page: { pageId: AppPageId };
  PostScrap: undefined;
  ScrapDetails: { listing: ScrapListing };
  ManageBids: { listingId: number; listingTitle: string };
  ReportWaste: undefined;
  VerifyReports: undefined;
  WorkerTask: undefined;
  ScrapFeed: undefined;
  CitizenHistory: { initialTab: 'reports' | 'listings' };
  ScrapperBids: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Explore: undefined;
  Action: undefined;
  Rewards: undefined;
  Profile: undefined;
};
