import { Session } from "next-auth";

export function isAdmin(session: Session) {
  return session?.user?.role === "admin";
}

export function isPowerUser(session: Session) {
  return session?.user?.role === "power_user";
}

export function isAdminOrPowerUser(session: Session) {
  return isAdmin(session) || isPowerUser(session);
}
