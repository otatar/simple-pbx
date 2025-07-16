import { db } from "~/utils/db.server";

export async function getGeneralSettings() {
  return db.globalSettings.findFirst();
}

export async function updateGeneralSettings(data: {
  id: number;
  ringTimeout: number;
  maxCallDuration: number;
  subBranding?: string;
}) {
  return db.globalSettings.update({
    where: { id: data.id },
    data: {
      ringTimeout: data.ringTimeout,
      maxCallDuration: data.maxCallDuration,
      subBranding: data.subBranding,
    },
  });
}
