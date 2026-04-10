export type AppRole = "citizen" | "ngo" | "worker" | "champion" | "authority" | "scrapper" | "admin";

export const appRoles: AppRole[] = ["citizen", "ngo", "worker", "champion", "authority", "scrapper", "admin"];

export const roleLabels: Record<AppRole, string> = {
  citizen: "Citizen",
  ngo: "NGO",
  worker: "Waste Worker",
  champion: "Green Champion",
  authority: "Authority",
  scrapper: "Scrap Collector",
  admin: "System Admin",
};

// This helper safely maps frontend lowercase roles to the backend UPPERCASE expected by Zod
export const mapRoleToBackend = (role: AppRole): string => {
  return role.toUpperCase();
};