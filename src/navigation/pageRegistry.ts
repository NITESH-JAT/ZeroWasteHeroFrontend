type PageAction = {
  label: string;
  pageId?: string;
  tab?: "Home" | "Explore" | "Action" | "Rewards" | "Profile";
};

type PageConfig = {
  title: string;
  subtitle: string;
  accent: string;
  icon: string;
  stats: Array<{ label: string; value: string }>;
  sections: Array<{ title: string; items: string[] }>;
  primaryAction?: PageAction;
  secondaryAction?: PageAction;
};

export const appPages: Record<string, PageConfig> = {
  notifications: {
    title: "Notifications",
    subtitle: "Review alerts, reminders, approvals, and reward updates in one place.",
    accent: "#0EA5E9",
    icon: "bell-ring-outline",
    stats: [
      { label: "Unread", value: "7" },
      { label: "Priority", value: "2" },
      { label: "Today", value: "11" },
    ],
    sections: [
      { title: "Recent Alerts", items: ["Shift reminder at 08:00 AM", "Campaign approval from Ward 4 is pending", "Reward redemption was processed"] },
      { title: "Suggested Actions", items: ["Review high-priority alerts first", "Mark finished items as read", "Tune preferences from settings"] },
    ],
  },
  settingsOverview: {
    title: "Settings",
    subtitle: "Overview of account preferences, alerts, privacy, and support.",
    accent: "#0F172A",
    icon: "cog-outline",
    stats: [
      { label: "Sections", value: "5" },
      { label: "Updated", value: "Today" },
      { label: "Sync", value: "On" },
    ],
    sections: [
      { title: "Settings Areas", items: ["Notifications", "Privacy & Security", "Support", "Display preferences"] },
    ],
    primaryAction: { label: "Open Notifications", pageId: "notifications" },
    secondaryAction: { label: "Privacy & Security", pageId: "privacySecurity" },
  },
  nearbyCampaigns: {
    title: "Nearby Campaigns",
    subtitle: "Discover clean-up drives, volunteering opportunities, and ward challenges near you.",
    accent: "#00D65B",
    icon: "map-marker-radius-outline",
    stats: [
      { label: "Nearby", value: "12" },
      { label: "This Week", value: "4" },
      { label: "Open Seats", value: "186" },
    ],
    sections: [
      { title: "Hotspots", items: ["City Beach Cleanup Drive", "Sector 4 Park Restoration", "Riverfront Plastic Recovery Drive"] },
      { title: "How To Join", items: ["Review rules and meeting point", "Confirm attendance and time slot", "Upload participation proof for points"] },
    ],
    primaryAction: { label: "Open Explore Tab", tab: "Explore" },
  },
  reportWaste: {
    title: "Report Waste",
    subtitle: "Capture a geo-tagged waste report with images, notes, and severity details.",
    accent: "#00D65B",
    icon: "camera-plus-outline",
    stats: [
      { label: "Avg Review", value: "18m" },
      { label: "Bonus", value: "+120" },
      { label: "Accuracy", value: "94%" },
    ],
    sections: [
      { title: "What To Include", items: ["A clear wide-angle image", "Landmark or location notes", "Waste type and urgency"] },
      { title: "After Submission", items: ["Champion reviews the proof", "Workers receive the route task", "Points are credited after closure"] },
    ],
  },
  arWasteHunt: {
    title: "AR Waste Hunt",
    subtitle: "Gamified exploration mode that turns local reporting into neighborhood cleanup missions.",
    accent: "#00D65B",
    icon: "view-grid-plus-outline",
    stats: [
      { label: "Live Hunts", value: "3" },
      { label: "Boost", value: "2x" },
      { label: "Teams", value: "24" },
    ],
    sections: [
      { title: "Mission Types", items: ["Spot hidden waste hotspots", "Complete area sweeps", "Earn combo bonuses with teammates"] },
      { title: "Recommended Setup", items: ["Enable camera permissions", "Turn on precise location", "Use daylight for clearer proof capture"] },
    ],
  },
  joinCampaign: {
    title: "Join Campaign",
    subtitle: "Browse upcoming drives, register instantly, and track your assigned shift.",
    accent: "#0EA5E9",
    icon: "account-group-outline",
    stats: [
      { label: "Open Drives", value: "9" },
      { label: "Your RSVP", value: "2" },
      { label: "Impact", value: "340 kg" },
    ],
    sections: [
      { title: "Participation Flow", items: ["Choose a campaign by distance and points", "Confirm your slot", "Check in using QR or photo proof"] },
    ],
    primaryAction: { label: "View Nearby Campaigns", pageId: "nearbyCampaigns" },
  },
  missionWeekendWarrior: {
    title: "Weekend Warrior",
    subtitle: "Mission progress for reporting three waste hotspots before the weekend challenge closes.",
    accent: "#F59E0B",
    icon: "lightning-bolt-outline",
    stats: [
      { label: "Progress", value: "1/3" },
      { label: "Reward", value: "+300" },
      { label: "Ends", value: "2 days" },
    ],
    sections: [{ title: "Challenge Rules", items: ["Only verified reports count", "Reports must be from separate locations", "Third report unlocks the bonus"] }],
  },
  missionRecyclingPro: {
    title: "Recycling Pro",
    subtitle: "A guided mission focused on correct segregation and e-waste drop-off accuracy.",
    accent: "#00D65B",
    icon: "recycle",
    stats: [
      { label: "Reward", value: "+500" },
      { label: "Tier", value: "Silver" },
      { label: "Submissions", value: "18" },
    ],
    sections: [{ title: "Completion Tips", items: ["Use the segregation checklist", "Attach category-specific photos", "Choose an approved drop-off location"] }],
  },
  createCampaign: {
    title: "Create Campaign",
    subtitle: "Set campaign goals, schedule volunteers, and publish a new clean-up drive.",
    accent: "#0EA5E9",
    icon: "calendar-plus",
    stats: [
      { label: "Drafts", value: "2" },
      { label: "Active", value: "12" },
      { label: "Volunteers", value: "340" },
    ],
    sections: [{ title: "Campaign Setup", items: ["Define area and schedule", "Assign proof requirements", "Set volunteer rewards"] }],
  },
  volunteerSubmissions: {
    title: "Volunteer Submissions",
    subtitle: "Review uploaded proof, attendance confirmations, and completion evidence.",
    accent: "#F59E0B",
    icon: "clipboard-check-multiple-outline",
    stats: [
      { label: "Pending", value: "14" },
      { label: "Approved", value: "87" },
      { label: "Flagged", value: "3" },
    ],
    sections: [{ title: "Review Checklist", items: ["Validate timestamp and location", "Confirm before and after images", "Approve or request resubmission"] }],
  },
  campaignBeachCleanup: {
    title: "City Beach Cleanup Drive",
    subtitle: "A high-impact coastal cleanup campaign with volunteer slots and leaderboard rewards.",
    accent: "#0EA5E9",
    icon: "beach",
    stats: [
      { label: "Distance", value: "2.5 km" },
      { label: "Reward", value: "500" },
      { label: "Seats", value: "42" },
    ],
    sections: [
      { title: "Event Snapshot", items: ["Saturday at 08:00 AM", "Hosted by EarthWarriors Foundation", "Focus area: plastic waste sorting"] },
      { title: "What To Bring", items: ["Reusable water bottle", "Closed shoes and gloves", "Phone for proof check-in"] },
    ],
  },
  campaignParkRestoration: {
    title: "Sector 4 Park Restoration",
    subtitle: "Community restoration drive focused on cleanup, planting, and awareness.",
    accent: "#00D65B",
    icon: "pine-tree",
    stats: [
      { label: "Distance", value: "5.0 km" },
      { label: "Reward", value: "300" },
      { label: "Volunteers", value: "65" },
    ],
    sections: [{ title: "Focus Areas", items: ["Plastic collection", "Compost pit setup", "Native sapling planting"] }],
  },
  filterCampaigns: {
    title: "Campaign Filters",
    subtitle: "Narrow the explore feed by date, distance, reward points, and campaign type.",
    accent: "#0F172A",
    icon: "tune-variant",
    stats: [
      { label: "Sorts", value: "5" },
      { label: "Tags", value: "14" },
      { label: "Saved", value: "2" },
    ],
    sections: [{ title: "Suggested Filters", items: ["Under 5 km", "Weekend only", "High-reward campaigns"] }],
  },
  liveMapAccess: {
    title: "Interactive Map View",
    subtitle: "Visualize nearby incidents, campaign zones, and assigned routes on the city map.",
    accent: "#0EA5E9",
    icon: "map-search-outline",
    stats: [
      { label: "Pins", value: "128" },
      { label: "Layers", value: "4" },
      { label: "Live", value: "Yes" },
    ],
    sections: [{ title: "Available Layers", items: ["Active campaigns", "Open reports", "Worker routes", "Dumping zones"] }],
  },
  cityLeaderboard: {
    title: "City Leaderboard",
    subtitle: "Compare neighborhoods, volunteers, and campaign teams by impact and consistency.",
    accent: "#F59E0B",
    icon: "trophy-award",
    stats: [
      { label: "Ward Rank", value: "#4" },
      { label: "Top Score", value: "9,240" },
      { label: "Streak", value: "7 days" },
    ],
    sections: [{ title: "Ranking Metrics", items: ["Verified reports", "Kg waste diverted", "Campaign participation", "Response speed"] }],
  },
  rewardsHub: {
    title: "Rewards Wallet",
    subtitle: "Track your balance, badge progress, and available redemptions from one view.",
    accent: "#8B5CF6",
    icon: "wallet-giftcard",
    stats: [
      { label: "Balance", value: "3,250" },
      { label: "Badges", value: "6" },
      { label: "Redeemed", value: "12" },
    ],
    sections: [{ title: "Quick Links", items: ["Open the main Rewards tab", "View reward history", "Browse the marketplace"] }],
    primaryAction: { label: "Open Rewards Tab", tab: "Rewards" },
  },
  rewardHistory: {
    title: "Reward History",
    subtitle: "See every earning, redemption, adjustment, and campaign payout tied to your account.",
    accent: "#0F172A",
    icon: "history",
    stats: [
      { label: "Entries", value: "48" },
      { label: "This Month", value: "+820" },
      { label: "Redeemed", value: "5" },
    ],
    sections: [{ title: "Recent Activity", items: ["Beach cleanup reward credited", "Movie voucher redeemed", "Mission bonus from weekend challenge"] }],
  },
  badgesOverview: {
    title: "Badge Collection",
    subtitle: "View earned badges, locked milestones, and certification-based achievements.",
    accent: "#F59E0B",
    icon: "medal-outline",
    stats: [
      { label: "Earned", value: "8" },
      { label: "In Progress", value: "3" },
      { label: "Legendary", value: "1" },
    ],
    sections: [{ title: "Featured Badges", items: ["Guardian", "Recycler", "7-Day Streak", "Safety Pro"] }],
  },
  rewardsMarketplace: {
    title: "Rewards Marketplace",
    subtitle: "Browse vouchers, gear, transit perks, and sustainability products for redemption.",
    accent: "#00D65B",
    icon: "storefront-outline",
    stats: [
      { label: "Items", value: "24" },
      { label: "New", value: "5" },
      { label: "Min Cost", value: "500" },
    ],
    sections: [{ title: "Popular Rewards", items: ["Movie Voucher", "Compost Kit", "Transit Pass", "Safety Gloves"] }],
  },
  movieVoucher: {
    title: "Movie Voucher",
    subtitle: "Redeem GreenPoints for a discounted cinema voucher with instant code delivery.",
    accent: "#0EA5E9",
    icon: "ticket-percent",
    stats: [
      { label: "Cost", value: "1500" },
      { label: "Value", value: "Rs150" },
      { label: "Stock", value: "32" },
    ],
    sections: [{ title: "Redemption Notes", items: ["Valid for 30 days", "One voucher per redemption", "Codes arrive in notifications"] }],
  },
  compostKit: {
    title: "Compost Kit",
    subtitle: "Starter home composting bundle with guide, tray, and odor-control material.",
    accent: "#00D65B",
    icon: "flower",
    stats: [
      { label: "Cost", value: "2000" },
      { label: "Delivery", value: "4 days" },
      { label: "Stock", value: "18" },
    ],
    sections: [{ title: "Included", items: ["Beginner guide", "Compact compost tray", "Starter culture pack"] }],
  },
  transitPass: {
    title: "Transit Pass",
    subtitle: "Redeem a one-day local transit pass as a mobility reward for eco-friendly participation.",
    accent: "#8B5CF6",
    icon: "bus",
    stats: [
      { label: "Cost", value: "800" },
      { label: "Validity", value: "1 day" },
      { label: "Zones", value: "All City" },
    ],
    sections: [{ title: "Usage", items: ["Activate on the selected day", "Show QR to the conductor", "One redemption per week"] }],
  },
  groceryCoupon: {
    title: "Grocery Coupon",
    subtitle: "Claim a partner-store coupon and use your reward points on household essentials.",
    accent: "#F59E0B",
    icon: "shopping",
    stats: [
      { label: "Cost", value: "1000" },
      { label: "Discount", value: "10%" },
      { label: "Stores", value: "26" },
    ],
    sections: [{ title: "Partner Stores", items: ["FreshKart", "Daily Basket", "Metro Green Mart"] }],
  },
  allocateCampaignRewards: {
    title: "Allocate Campaign Rewards",
    subtitle: "Set point values, campaign completion bonuses, and volunteer eligibility conditions.",
    accent: "#0EA5E9",
    icon: "hand-coin-outline",
    stats: [
      { label: "Active Rules", value: "6" },
      { label: "Pending", value: "2" },
      { label: "Budget", value: "50,000" },
    ],
    sections: [{ title: "Controls", items: ["Base points per volunteer", "Bonus for photo proof", "Multiplier for high-priority zones"] }],
  },
  ngoRecognition: {
    title: "NGO Recognition",
    subtitle: "Review partner-level achievements, trust signals, and public credibility badges.",
    accent: "#F59E0B",
    icon: "certificate-outline",
    stats: [
      { label: "Tier", value: "Platinum" },
      { label: "Campaigns", value: "21" },
      { label: "Rating", value: "4.9" },
    ],
    sections: [{ title: "Recognition Factors", items: ["Volunteer satisfaction", "Proof approval quality", "Campaign completion rate"] }],
  },
  awardBonusPoints: {
    title: "Award Bonus Points",
    subtitle: "Distribute bonus incentives to neighborhoods and residents with standout performance.",
    accent: "#8B5CF6",
    icon: "medal-outline",
    stats: [
      { label: "Pool", value: "10,000" },
      { label: "Wards", value: "5" },
      { label: "Top Block", value: "A2" },
    ],
    sections: [{ title: "Allocation Rules", items: ["Distribute only to verified winners", "Track reason for each bonus", "Publish summary for transparency"] }],
  },
  distributionLogs: {
    title: "Distribution Logs",
    subtitle: "Audit the history of bonus awards, reward transfers, and community pool usage.",
    accent: "#0F172A",
    icon: "history",
    stats: [
      { label: "Entries", value: "96" },
      { label: "This Quarter", value: "18" },
      { label: "Flags", value: "0" },
    ],
    sections: [{ title: "Audit Focus", items: ["Recipient details", "Approver identity", "Timestamp and reason code"] }],
  },
  partnerManagement: {
    title: "Partner Management",
    subtitle: "Manage sponsor relationships, renewal timelines, and co-branded reward programs.",
    accent: "#F43F5E",
    icon: "handshake-outline",
    stats: [
      { label: "Sponsors", value: "14" },
      { label: "Renewals", value: "3" },
      { label: "Active MOU", value: "11" },
    ],
    sections: [{ title: "Partner Tasks", items: ["Review sponsor commitments", "Track reward inventory support", "Approve brand visibility plans"] }],
  },
  fundAllocation: {
    title: "Fund Allocation",
    subtitle: "Distribute program budgets to NGOs and wards while maintaining spending transparency.",
    accent: "#0EA5E9",
    icon: "bank-transfer",
    stats: [
      { label: "Budget", value: "2.5M" },
      { label: "NGOs", value: "8" },
      { label: "This Month", value: "420k" },
    ],
    sections: [{ title: "Allocation Checks", items: ["Confirm utilization reports", "Validate milestone achievement", "Approve next tranche release"] }],
  },
  closeActiveTask: {
    title: "Close Active Task",
    subtitle: "Upload after-cleaning proof, note collected volume, and complete the assigned cleanup task.",
    accent: "#F59E0B",
    icon: "camera-burst",
    stats: [
      { label: "Open Tasks", value: "5" },
      { label: "Today", value: "12 done" },
      { label: "Avg Close", value: "14m" },
    ],
    sections: [{ title: "Proof Requirements", items: ["Before and after image", "Task zone visible", "Collected material estimate"] }],
  },
  reportIssue: {
    title: "Report Operational Issue",
    subtitle: "Escalate blocked routes, overflowing bins, equipment faults, or safety hazards.",
    accent: "#F43F5E",
    icon: "alert-octagon-outline",
    stats: [
      { label: "Urgent", value: "2" },
      { label: "Open", value: "7" },
      { label: "Resolved", value: "31" },
    ],
    sections: [{ title: "Issue Categories", items: ["Vehicle breakdown", "Unsafe waste", "Public obstruction", "Staffing shortage"] }],
  },
  viewRoute: {
    title: "Assigned Route",
    subtitle: "Check your route order, area coverage, and task priorities before heading out.",
    accent: "#0F172A",
    icon: "map-marker-path",
    stats: [
      { label: "Stops", value: "8" },
      { label: "Distance", value: "14 km" },
      { label: "ETA", value: "7h 30m" },
    ],
    sections: [{ title: "Route Sequence", items: ["Sector 4 Park", "Zone B Community Bins", "Market Road collection point"] }],
  },
  clearSector4Park: {
    title: "Clear Sector 4 Park",
    subtitle: "High-priority cleanup task generated from a verified public report in the park zone.",
    accent: "#F43F5E",
    icon: "alert-circle-outline",
    stats: [
      { label: "Priority", value: "High" },
      { label: "Assigned", value: "Now" },
      { label: "SLA", value: "2h" },
    ],
    sections: [{ title: "Task Notes", items: ["Citizen report already verified", "Focus on southeast corner", "Upload after-cleaning proof"] }],
  },
  binEmptyingZoneB: {
    title: "Bin Emptying: Zone B",
    subtitle: "Routine route assignment covering waste bin emptying and overflow checks.",
    accent: "#64748B",
    icon: "trash-can-outline",
    stats: [
      { label: "Stops", value: "12" },
      { label: "Priority", value: "Standard" },
      { label: "Window", value: "3h" },
    ],
    sections: [{ title: "Checklist", items: ["Scan route checkpoints", "Record overflow levels", "Mark blocked bins for follow-up"] }],
  },
  verifyReports: {
    title: "Verify Reports",
    subtitle: "Approve valid citizen reports, reject duplicates, and assign next-step operations.",
    accent: "#8B5CF6",
    icon: "check-decagram-outline",
    stats: [
      { label: "Pending", value: "18" },
      { label: "Avg Time", value: "7m" },
      { label: "Accuracy", value: "96%" },
    ],
    sections: [{ title: "Review Criteria", items: ["Location consistency", "Photo authenticity", "Waste visibility and scale"] }],
  },
  flaggedItems: {
    title: "Flagged Items",
    subtitle: "Review suspicious reports, duplicate submissions, and moderation escalations.",
    accent: "#F43F5E",
    icon: "flag-outline",
    stats: [
      { label: "Flagged", value: "6" },
      { label: "Urgent", value: "1" },
      { label: "Escalated", value: "2" },
    ],
    sections: [{ title: "Flag Reasons", items: ["Potential duplicate", "Low-quality evidence", "Location mismatch", "Abusive content"] }],
  },
  communityMap: {
    title: "Community Map",
    subtitle: "See report density, campaign activity, and volunteer heatmaps across the community.",
    accent: "#0F172A",
    icon: "map-search-outline",
    stats: [
      { label: "Reports", value: "240" },
      { label: "Wards", value: "15" },
      { label: "Live Layers", value: "3" },
    ],
    sections: [{ title: "Map Insights", items: ["Recurring dumping zones", "Top volunteer clusters", "Areas with delayed cleanup response"] }],
  },
  escalations: {
    title: "Escalations",
    subtitle: "Handle reports and moderation events that need intervention beyond standard review flow.",
    accent: "#F43F5E",
    icon: "alert-octagon",
    stats: [
      { label: "Open", value: "4" },
      { label: "Critical", value: "1" },
      { label: "Resolved", value: "28" },
    ],
    sections: [{ title: "Escalation Triggers", items: ["Repeated false reporting", "Sensitive municipal location", "Hazardous or medical waste"] }],
  },
  issuePenalty: {
    title: "Issue Penalty",
    subtitle: "Log fines, document violations, and generate action records for non-compliant entities.",
    accent: "#F43F5E",
    icon: "gavel",
    stats: [
      { label: "Open Cases", value: "8" },
      { label: "Processed", value: "21" },
      { label: "Collected", value: "Rs84k" },
    ],
    sections: [{ title: "Penalty Workflow", items: ["Select violation category", "Attach evidence", "Notify the responsible entity", "Track payment resolution"] }],
  },
  ngoApprovals: {
    title: "NGO Approvals",
    subtitle: "Review organization applications, verify legal documents, and activate approved partners.",
    accent: "#0EA5E9",
    icon: "file-document-check",
    stats: [
      { label: "Pending", value: "5" },
      { label: "Docs", value: "23" },
      { label: "Approved", value: "41" },
    ],
    sections: [{ title: "Required Checks", items: ["Registration validity", "Banking details", "Impact proof", "Field capacity"] }],
  },
  broadcastAlert: {
    title: "Broadcast Alert",
    subtitle: "Send role-based announcements, emergency notices, or campaign-wide operational alerts.",
    accent: "#0F172A",
    icon: "bullhorn-outline",
    stats: [
      { label: "Audience", value: "12k" },
      { label: "Templates", value: "8" },
      { label: "Sent Today", value: "3" },
    ],
    sections: [{ title: "Delivery Options", items: ["All users", "Ward-specific groups", "Only workers", "Only NGO admins"] }],
  },
  reportHistory: {
    title: "Report History",
    subtitle: "Review previous citizen reports, their verification outcome, and earned points.",
    accent: "#00D65B",
    icon: "history",
    stats: [
      { label: "Reports", value: "42" },
      { label: "Verified", value: "37" },
      { label: "Points", value: "3,250" },
    ],
    sections: [{ title: "Recent Reports", items: ["Overflow bin near Market Road", "Illegal dumping beside lake road", "Unsegregated waste in Block C"] }],
  },
  myCertificates: {
    title: "My Certificates",
    subtitle: "All earned certifications, badges, and verified training completions linked to your profile.",
    accent: "#F59E0B",
    icon: "medal-outline",
    stats: [
      { label: "Earned", value: "5" },
      { label: "Verified", value: "5" },
      { label: "Expiring", value: "1" },
    ],
    sections: [{ title: "Included", items: ["Segregation basics", "Citizen reporting excellence", "Neighborhood cleanup participation"] }],
    primaryAction: { label: "Open Rewards Tab", tab: "Rewards" },
  },
  trainingModules: {
    title: "Training Modules",
    subtitle: "Structured lessons covering segregation, safe reporting, field protocols, and civic action.",
    accent: "#00D65B",
    icon: "school-outline",
    stats: [
      { label: "Modules", value: "12" },
      { label: "Completed", value: "8" },
      { label: "Required", value: "3" },
    ],
    sections: [{ title: "Learning Paths", items: ["Waste segregation", "Reporting best practices", "Volunteer safety basics"] }],
  },
  verificationStatus: {
    title: "Verification Status",
    subtitle: "Check NGO document verification, trust indicators, and compliance renewal deadlines.",
    accent: "#0EA5E9",
    icon: "shield-check-outline",
    stats: [
      { label: "Status", value: "Verified" },
      { label: "Renewal", value: "34 days" },
      { label: "Documents", value: "6/6" },
    ],
    sections: [{ title: "Verified Records", items: ["Registration certificate", "PAN or tax profile", "Bank details", "Impact portfolio"] }],
  },
  impactReports: {
    title: "Impact Reports",
    subtitle: "Download organization-level analytics for CSR partners, donors, and municipal stakeholders.",
    accent: "#0EA5E9",
    icon: "file-download-outline",
    stats: [
      { label: "Reports", value: "14" },
      { label: "Last Export", value: "2 days" },
      { label: "Formats", value: "PDF / CSV" },
    ],
    sections: [{ title: "Metrics Included", items: ["Volunteer count", "Kg collected", "Campaign conversion", "Ward-level impact"] }],
  },
  workerIdCard: {
    title: "Worker ID Card",
    subtitle: "Official employment identity, municipal credentials, and assignment authorization details.",
    accent: "#F59E0B",
    icon: "badge-account-horizontal-outline",
    stats: [
      { label: "ID", value: "WW-9902" },
      { label: "Zone", value: "B" },
      { label: "Shift", value: "Morning" },
    ],
    sections: [{ title: "Card Details", items: ["Municipal workforce identity", "Assigned department and ward", "Emergency verification code"] }],
  },
  performanceHistory: {
    title: "Performance History",
    subtitle: "Track task completion speed, proof quality, attendance, and reward bonuses over time.",
    accent: "#F59E0B",
    icon: "clipboard-check-outline",
    stats: [
      { label: "Completed", value: "128" },
      { label: "On Time", value: "96%" },
      { label: "Rating", value: "4.8" },
    ],
    sections: [{ title: "Performance Areas", items: ["Task turnaround", "Proof compliance", "Route completion", "Safety adherence"] }],
  },
  safetyCertifications: {
    title: "Safety Certifications",
    subtitle: "Field safety, hazardous waste handling, and equipment-related training records.",
    accent: "#F59E0B",
    icon: "hard-hat",
    stats: [
      { label: "Active", value: "4" },
      { label: "Due Soon", value: "1" },
      { label: "Last Passed", value: "18 days" },
    ],
    sections: [{ title: "Covered Topics", items: ["Protective gear", "Hazard response", "Vehicle safety", "Bio-waste handling"] }],
  },
  championCredentials: {
    title: "Champion Credentials",
    subtitle: "Proof of moderation authority, ward assignment, and municipal endorsement for champions.",
    accent: "#8B5CF6",
    icon: "card-account-details-star-outline",
    stats: [
      { label: "Ward", value: "4" },
      { label: "Level", value: "Senior" },
      { label: "Valid", value: "2026" },
    ],
    sections: [{ title: "Credential Scope", items: ["Verify reports", "Escalate misconduct", "Award community bonuses"] }],
  },
  auditLogs: {
    title: "Audit Logs",
    subtitle: "Moderation timeline covering approvals, reversals, escalations, and decisions by timestamp.",
    accent: "#8B5CF6",
    icon: "format-list-bulleted",
    stats: [
      { label: "Entries", value: "233" },
      { label: "This Week", value: "17" },
      { label: "Flags", value: "0" },
    ],
    sections: [{ title: "Tracked Events", items: ["Verification decisions", "Escalation handoffs", "Bonus allocations", "Policy exceptions"] }],
  },
  userAccessControl: {
    title: "User Access Control",
    subtitle: "Manage role permissions, onboarding approvals, and authority boundaries.",
    accent: "#F43F5E",
    icon: "security",
    stats: [
      { label: "Roles", value: "5" },
      { label: "Admins", value: "12" },
      { label: "Requests", value: "4" },
    ],
    sections: [{ title: "Admin Tasks", items: ["Approve access changes", "Review role grants", "Deactivate expired accounts"] }],
  },
  cityReports: {
    title: "City Reports",
    subtitle: "Full ecosystem analytics across wards, programs, workforce, NGOs, and campaigns.",
    accent: "#F43F5E",
    icon: "chart-box-outline",
    stats: [
      { label: "Wards", value: "15" },
      { label: "KPIs", value: "28" },
      { label: "Exports", value: "9" },
    ],
    sections: [{ title: "Core Indicators", items: ["Segregation rate", "Response time", "Volunteer engagement", "Fund utilization"] }],
  },
  systemLogs: {
    title: "System Logs",
    subtitle: "Platform-level technical records for monitoring, sync events, and audit support.",
    accent: "#F43F5E",
    icon: "cogs",
    stats: [
      { label: "Events", value: "1.2k" },
      { label: "Errors", value: "3" },
      { label: "Uptime", value: "99.8%" },
    ],
    sections: [{ title: "Monitoring Focus", items: ["Sync failures", "Notification delivery", "User session issues", "Export job results"] }],
  },
  privacySecurity: {
    title: "Privacy & Security",
    subtitle: "Manage account safety, permissions, session visibility, and personal data preferences.",
    accent: "#0F172A",
    icon: "lock-outline",
    stats: [
      { label: "2FA", value: "Off" },
      { label: "Sessions", value: "2" },
      { label: "Last Review", value: "Today" },
    ],
    sections: [{ title: "Recommended Steps", items: ["Enable 2-factor authentication", "Review active sessions", "Limit profile visibility if needed"] }],
  },
  helpSupport: {
    title: "Help & Support",
    subtitle: "Get assistance for account issues, role flows, reward problems, and field operations.",
    accent: "#0EA5E9",
    icon: "help-circle-outline",
    stats: [
      { label: "Articles", value: "42" },
      { label: "Live Tickets", value: "1" },
      { label: "Avg Reply", value: "12m" },
    ],
    sections: [{ title: "Support Topics", items: ["Navigation help", "Proof upload issues", "Reward redemption", "Role switching and login"] }],
  },
  streakProgress: {
    title: "Streak Progress",
    subtitle: "Track your active reporting streak, badge milestones, and next unlocks.",
    accent: "#F59E0B",
    icon: "fire",
    stats: [
      { label: "Current", value: "7 days" },
      { label: "Best", value: "14 days" },
      { label: "Next Badge", value: "3 days" }
    ],
    sections: [{ title: "Momentum", items: ["Submit one verified report today", "Maintain your streak to unlock bonus points", "Streak rewards stack with campaign bonuses"] }]
  },
  recentReportsStatus: {
    title: "Recent Reports Status",
    subtitle: "See what happened to your latest submissions and which ones are still pending verification.",
    accent: "#0EA5E9",
    icon: "progress-clock",
    stats: [
      { label: "Pending", value: "2" },
      { label: "Verified", value: "37" },
      { label: "Resolved", value: "35" }
    ],
    sections: [{ title: "Latest Updates", items: ["Market Road overflow is pending champion review", "Lake Road dumping report was assigned to a worker", "Block C mixed waste issue has been resolved"] }]
  },
  ecoTips: {
    title: "Learning and Eco Tips",
    subtitle: "Short practical tips to improve segregation, reporting quality, and daily sustainability habits.",
    accent: "#00D65B",
    icon: "lightbulb-on-outline",
    stats: [
      { label: "Tips", value: "24" },
      { label: "Lessons", value: "12" },
      { label: "Completed", value: "8" }
    ],
    sections: [{ title: "Featured Tips", items: ["Photograph waste in daylight for faster verification", "Keep e-waste separate from wet waste", "Use landmark notes to improve route assignment accuracy"] }],
    primaryAction: { label: "Open Training Modules", pageId: "trainingModules" }
  },
  campaignParticipationHistory: {
    title: "Campaign Participation History",
    subtitle: "Review the cleanup drives you joined, your attendance, and the impact you contributed.",
    accent: "#0EA5E9",
    icon: "account-group-outline",
    stats: [
      { label: "Joined", value: "5" },
      { label: "Completed", value: "4" },
      { label: "Impact", value: "68 kg" }
    ],
    sections: [{ title: "Recent Participation", items: ["City Beach Cleanup Drive", "Sector 4 Park Restoration", "Ward 3 Weekend Cleanup"] }]
  },
  streakBonuses: {
    title: "Streak Bonuses",
    subtitle: "Bonus rewards available for consistent reporting and repeated campaign participation.",
    accent: "#8B5CF6",
    icon: "star-circle",
    stats: [
      { label: "Current Bonus", value: "+80" },
      { label: "Unlock In", value: "1 day" },
      { label: "Multiplier", value: "1.5x" }
    ],
    sections: [{ title: "How Bonuses Work", items: ["Daily verified activity builds your streak", "Higher streaks unlock larger bonus payouts", "Missing a day resets only the active streak bonus"] }]
  },  ngoDetails: {
    title: "NGO Details",
    subtitle: "Organization profile, mission summary, focus areas, and public-facing identity details.",
    accent: "#0EA5E9",
    icon: "office-building-outline",
    stats: [
      { label: "Members", value: "28" },
      { label: "Wards", value: "4" },
      { label: "Established", value: "2018" }
    ],
    sections: [{ title: "Organization Snapshot", items: ["EarthWarriors Foundation", "Focus on coastal and community cleanup", "Active in four municipal wards"] }]
  },
  ngoCampaignHistory: {
    title: "Campaign History",
    subtitle: "Review completed and archived campaigns with turnout, reach, and impact metrics.",
    accent: "#0EA5E9",
    icon: "history",
    stats: [
      { label: "Completed", value: "21" },
      { label: "Volunteers", value: "1.2k" },
      { label: "Impact", value: "12.4 t" }
    ],
    sections: [{ title: "Recent Campaigns", items: ["City Beach Cleanup Drive", "Ward 3 Plastic Recovery Day", "Sector 4 Park Restoration"] }]
  },
  ngoTeamMembers: {
    title: "Team Members",
    subtitle: "Coordinator, volunteer lead, field staff, and internal team roster overview.",
    accent: "#0EA5E9",
    icon: "account-group-outline",
    stats: [
      { label: "Core Team", value: "12" },
      { label: "Field Leads", value: "4" },
      { label: "Volunteers", value: "340" }
    ],
    sections: [{ title: "Roles", items: ["Campaign coordinator", "Volunteer lead", "Verification reviewer", "Field logistics"] }]
  },
  ngoCommunityFeed: {
    title: "Community Feed",
    subtitle: "A running view of campaign activity, volunteer updates, and partner interactions around your NGO.",
    accent: "#0EA5E9",
    icon: "post-outline",
    stats: [
      { label: "Posts", value: "48" },
      { label: "Mentions", value: "11" },
      { label: "Active", value: "Today" }
    ],
    sections: [{ title: "Feed Highlights", items: ["Volunteer signups increased for the beach drive", "Two partner NGOs shared your event", "New citizen interest in weekend cleanup activities"] }]
  },
  partnerNgos: {
    title: "Partner NGOs",
    subtitle: "Discover and review aligned NGOs, collaboration options, and joint-campaign opportunities.",
    accent: "#0EA5E9",
    icon: "handshake-outline",
    stats: [
      { label: "Partners", value: "8" },
      { label: "Active MOUs", value: "3" },
      { label: "Joint Drives", value: "5" }
    ],
    sections: [{ title: "Partner Network", items: ["GreenFuture India", "CleanCoast Collective", "Ward Action Forum"] }]
  },
  volunteerDiscovery: {
    title: "Volunteer Discovery",
    subtitle: "Find available volunteers, repeat participants, and high-impact supporters for future drives.",
    accent: "#00D65B",
    icon: "account-search-outline",
    stats: [
      { label: "Available", value: "126" },
      { label: "Repeat", value: "42" },
      { label: "Top Rated", value: "18" }
    ],
    sections: [{ title: "Discovery Filters", items: ["Nearby volunteers", "Past campaign participants", "High-verification contributors"] }]
  },
  pastCampaignAnalytics: {
    title: "Past Campaign Analytics",
    subtitle: "Performance insights for previous drives including turnout, waste collected, and community reach.",
    accent: "#8B5CF6",
    icon: "chart-line",
    stats: [
      { label: "Avg Turnout", value: "84" },
      { label: "Best Impact", value: "2.1 t" },
      { label: "Completion", value: "96%" }
    ],
    sections: [{ title: "Top Metrics", items: ["Volunteer turnout by area", "Waste diversion by campaign", "Reward cost versus impact"] }]
  },
  impactMilestones: {
    title: "Impact Milestones",
    subtitle: "Track major NGO achievements across volunteer turnout, cleanup weight, and campaign completion.",
    accent: "#00D65B",
    icon: "flag-checkered",
    stats: [
      { label: "Milestones", value: "9" },
      { label: "Next Goal", value: "15 t" },
      { label: "Current", value: "12.4 t" }
    ],
    sections: [{ title: "Recent Milestones", items: ["1,000 volunteer hours crossed", "10 tons waste diverted", "20 campaigns successfully completed"] }]
  },
  campaignRewardsSummary: {
    title: "Campaign Rewards Summary",
    subtitle: "Overview of reward budgets, campaign payouts, and point allocation efficiency.",
    accent: "#F59E0B",
    icon: "gift-outline",
    stats: [
      { label: "Allocated", value: "50,000" },
      { label: "Issued", value: "37,400" },
      { label: "Pending", value: "12,600" }
    ],
    sections: [{ title: "Reward Overview", items: ["Beach cleanup volunteer rewards", "Weekend challenge bonuses", "Verification-linked completion points"] }]
  },
  contributionInsights: {
    title: "Contribution Insights",
    subtitle: "See how volunteer hours, partner support, and campaign efforts translate into measurable impact.",
    accent: "#8B5CF6",
    icon: "chart-donut",
    stats: [
      { label: "Hours", value: "2.8k" },
      { label: "Reach", value: "18 wards" },
      { label: "Engagement", value: "4.9" }
    ],
    sections: [{ title: "Insight Areas", items: ["Volunteer retention", "Partner contribution mix", "High-performing campaign zones"] }]
  },  workerInfo: {
    title: "Worker Info",
    subtitle: "Basic worker identity, employment details, and official municipal assignment information.",
    accent: "#F59E0B",
    icon: "badge-account-horizontal-outline",
    stats: [
      { label: "ID", value: "WW-9902" },
      { label: "Shift", value: "Morning" },
      { label: "Status", value: "Active" }
    ],
    sections: [{ title: "Worker Snapshot", items: ["Rajesh Kumar", "Solid waste field operations", "Morning route team"] }]
  },
  assignedZone: {
    title: "Assigned Zone",
    subtitle: "Current operational zone, route area, and nearby coverage segments assigned to the worker.",
    accent: "#F59E0B",
    icon: "map-marker-radius-outline",
    stats: [
      { label: "Zone", value: "B" },
      { label: "Sectors", value: "4" },
      { label: "Stops", value: "12" }
    ],
    sections: [{ title: "Coverage", items: ["Zone B community bins", "Sector 4 park edge", "Market road collection points"] }]
  },
  taskHistory: {
    title: "Task History",
    subtitle: "Past assigned, completed, and verified cleanup tasks with timestamps and closure details.",
    accent: "#F59E0B",
    icon: "history",
    stats: [
      { label: "Completed", value: "128" },
      { label: "This Week", value: "24" },
      { label: "Verified", value: "121" }
    ],
    sections: [{ title: "Recent Closures", items: ["Sector 4 Park debris removal", "Zone B bin emptying", "Lakeside overflow cleanup"] }]
  },
  taskList: {
    title: "Task List",
    subtitle: "All active and upcoming work items currently assigned to the worker.",
    accent: "#F59E0B",
    icon: "format-list-checks",
    stats: [
      { label: "Assigned", value: "17" },
      { label: "Today", value: "5" },
      { label: "Urgent", value: "2" }
    ],
    sections: [{ title: "Current Tasks", items: ["Clear Sector 4 Park", "Zone B bin emptying", "Market Road overflow response"] }]
  },
  areaAssignedWork: {
    title: "Area-wise Assigned Work",
    subtitle: "Grouped view of worker tasks by area, stop, and operational coverage segment.",
    accent: "#0EA5E9",
    icon: "map-search-outline",
    stats: [
      { label: "Areas", value: "4" },
      { label: "Stops", value: "12" },
      { label: "Pending", value: "5" }
    ],
    sections: [{ title: "Assigned Areas", items: ["Zone B community bins", "Sector 4 park", "Market road stretch"] }]
  },
  closedTasks: {
    title: "Closed Tasks",
    subtitle: "Tasks already completed and submitted for final or verified closure.",
    accent: "#00D65B",
    icon: "check-decagram-outline",
    stats: [
      { label: "Closed", value: "12" },
      { label: "Verified", value: "10" },
      { label: "Awaiting Final", value: "2" }
    ],
    sections: [{ title: "Recent Closures", items: ["Lakeside mixed waste removal", "Bin Emptying Zone B", "Sector 3 lane sweep"] }]
  },
  pendingTasks: {
    title: "Pending Tasks",
    subtitle: "Work items still open, waiting for completion, proof upload, or final verification.",
    accent: "#F43F5E",
    icon: "progress-clock",
    stats: [
      { label: "Pending", value: "5" },
      { label: "High", value: "2" },
      { label: "Standard", value: "3" }
    ],
    sections: [{ title: "Open Items", items: ["Clear Sector 4 Park", "Market Road overflow response", "Zone B secondary sweep"] }]
  },
  performanceScore: {
    title: "Performance Score",
    subtitle: "Overall field performance summary based on task speed, proof quality, and consistency.",
    accent: "#8B5CF6",
    icon: "speedometer",
    stats: [
      { label: "Score", value: "92" },
      { label: "Rank", value: "Top 10%" },
      { label: "Trend", value: "+6" }
    ],
    sections: [{ title: "Score Drivers", items: ["On-time task completion", "High proof quality", "Low route misses"] }]
  },
  workerCompletionStats: {
    title: "Completion Stats",
    subtitle: "Daily and weekly task completion numbers for the worker route and assigned areas.",
    accent: "#0EA5E9",
    icon: "chart-bar",
    stats: [
      { label: "Today", value: "12" },
      { label: "Week", value: "47" },
      { label: "On Time", value: "96%" }
    ],
    sections: [{ title: "Completion Windows", items: ["Morning route performance", "Daily closure count", "Weekly verified completions"] }]
  },
  incentiveSummary: {
    title: "Incentive Summary",
    subtitle: "Summary of earned incentives, performance-linked rewards, and pending payouts.",
    accent: "#F59E0B",
    icon: "cash-multiple",
    stats: [
      { label: "Earned", value: "1,800" },
      { label: "Pending", value: "320" },
      { label: "This Week", value: "+240" }
    ],
    sections: [{ title: "Incentive Breakdown", items: ["Completion bonus", "Speed reward", "Quality proof bonus"] }]
  },
  championInfo: {
    title: "Champion Info",
    subtitle: "Profile summary for the ward champion, moderation role, and assigned authority scope.",
    accent: "#8B5CF6",
    icon: "card-account-details-star-outline",
    stats: [
      { label: "Ward", value: "4" },
      { label: "Level", value: "Senior" },
      { label: "Status", value: "Active" }
    ],
    sections: [{ title: "Champion Snapshot", items: ["Priya Patel", "Ward 4 moderation lead", "Municipal verification authority"] }]
  },
  verificationHistory: {
    title: "Verification History",
    subtitle: "Recent report moderation decisions, timestamps, and action patterns for the champion.",
    accent: "#8B5CF6",
    icon: "history",
    stats: [
      { label: "Reviewed", value: "233" },
      { label: "Approved", value: "198" },
      { label: "Rejected", value: "35" }
    ],
    sections: [{ title: "Recent Decisions", items: ["Market Road overflow approved", "Lake Road duplicate rejected", "Block C issue escalated for review"] }]
  },
  approvalRate: {
    title: "Approval Rate",
    subtitle: "Champion moderation quality view showing approval trends, consistency, and false-positive control.",
    accent: "#0EA5E9",
    icon: "chart-line",
    stats: [
      { label: "Rate", value: "85%" },
      { label: "Accuracy", value: "96%" },
      { label: "Trend", value: "+4%" }
    ],
    sections: [{ title: "Rate Drivers", items: ["Clear proof approval", "Duplicate rejection accuracy", "Escalation discipline"] }]
  },
  verificationQueue: {
    title: "Verification Queue",
    subtitle: "Open reports waiting for champion moderation and next-step action.",
    accent: "#8B5CF6",
    icon: "check-decagram-outline",
    stats: [
      { label: "Pending", value: "18" },
      { label: "Urgent", value: "4" },
      { label: "Avg Time", value: "7m" }
    ],
    sections: [{ title: "Queue Snapshot", items: ["Overflow bin near Market Road", "Illegal dumping beside lake road", "Mixed waste near Block C park gate"] }],
    primaryAction: { label: "Open Verification Flow", pageId: "verifyReports" }
  },
  recentApprovedReports: {
    title: "Recent Approved Reports",
    subtitle: "Latest citizen reports approved and routed forward for action or closure.",
    accent: "#00D65B",
    icon: "check-circle-outline",
    stats: [
      { label: "Approved", value: "198" },
      { label: "Today", value: "11" },
      { label: "Forwarded", value: "9" }
    ],
    sections: [{ title: "Recent Approvals", items: ["Market Road overflow", "Sector 6 mixed waste pile", "Ward 2 dumping spot"] }]
  },
  rejectedReports: {
    title: "Rejected Reports",
    subtitle: "Reports rejected because of duplicate evidence, unclear proof, or location mismatch.",
    accent: "#F43F5E",
    icon: "close-octagon-outline",
    stats: [
      { label: "Rejected", value: "35" },
      { label: "This Week", value: "6" },
      { label: "Duplicates", value: "3" }
    ],
    sections: [{ title: "Top Rejection Reasons", items: ["Duplicate report", "Low image clarity", "Location mismatch"] }]
  },
  communityEscalations: {
    title: "Community Escalations",
    subtitle: "Items the champion flagged upward because they need deeper review or authority support.",
    accent: "#F43F5E",
    icon: "alert-octagon-outline",
    stats: [
      { label: "Open", value: "4" },
      { label: "Critical", value: "1" },
      { label: "Awaiting", value: "2" }
    ],
    sections: [{ title: "Escalated Cases", items: ["Repeated illegal dumping", "Unsafe biomedical waste evidence", "Boundary dispute on report location"] }]
  },
  accuracyScore: {
    title: "Accuracy Score",
    subtitle: "Champion moderation accuracy score based on decision quality and post-review corrections.",
    accent: "#8B5CF6",
    icon: "target",
    stats: [
      { label: "Score", value: "96%" },
      { label: "Corrections", value: "3" },
      { label: "Trend", value: "+2" }
    ],
    sections: [{ title: "Accuracy Drivers", items: ["Correct duplicate detection", "Consistent approval quality", "Low reversal rate"] }]
  },
  verificationStreak: {
    title: "Verification Streak",
    subtitle: "Track the current streak of daily moderation activity and consistent queue handling.",
    accent: "#F59E0B",
    icon: "fire",
    stats: [
      { label: "Current", value: "14 days" },
      { label: "Best", value: "21 days" },
      { label: "Bonus", value: "+120" }
    ],
    sections: [{ title: "Streak Notes", items: ["Moderate at least one report daily", "Maintain decision consistency", "Streak bonuses improve champion standing"] }]
  },
  communityTrustMetrics: {
    title: "Community Trust Metrics",
    subtitle: "Trust indicators for champion moderation based on user feedback, reversals, and response consistency.",
    accent: "#0EA5E9",
    icon: "account-group-outline",
    stats: [
      { label: "Trust", value: "4.9" },
      { label: "Feedback", value: "92%" },
      { label: "Reversals", value: "1.2%" }
    ],
    sections: [{ title: "Trust Signals", items: ["Fast response on urgent reports", "High approval confidence", "Transparent escalation handling"] }]
  },} as const;

export type AppPageId = keyof typeof appPages;




