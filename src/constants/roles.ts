export const appRoles = [
  "citizen",
  "ngo",
  "worker",
  "champion",
  "authority",
] as const;

export type AppRole = (typeof appRoles)[number];

export const roleLabels: Record<AppRole, string> = {
  citizen: "Citizen",
  ngo: "NGO",
  worker: "Waste Worker",
  champion: "Green Champion",
  authority: "Authority",
};
