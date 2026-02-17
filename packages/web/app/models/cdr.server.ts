import db from "~/utils/db.server";

export async function getCDRs() {
  const cdrs = await db.cdr.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return cdrs;
}

export async function getCDRById(id: number) {
  const cdr = await db.cdr.findUnique({
    where: { id },
  });

  return cdr;
}

export function getCdrCount() {
  return db.cdr.count();
}

export function getLastTenDaysInboundCDRData() {
  const today = new Date();
  const tenDaysAgo = new Date(today);
  tenDaysAgo.setDate(today.getDate() - 9);

  return db.$queryRaw<
    { call_date: string; call_count: number }[]
  >`SELECT DATE(startTime) AS call_date, COUNT(*) AS call_count FROM Cdr WHERE startTime >= ${tenDaysAgo} AND destinationType = "extension" GROUP BY DATE(startTime) ORDER BY call_date ASC;`;
}

export function getLastTenDaysOutboundCDRData() {
  const today = new Date();
  const tenDaysAgo = new Date(today);
  tenDaysAgo.setDate(today.getDate() - 9);

  return db.$queryRaw<
    { call_date: string; call_count: number }[]
  >`SELECT DATE(startTime) AS call_date, COUNT(*) AS call_count FROM Cdr WHERE startTime >= ${tenDaysAgo} AND sourceType = "extension" GROUP BY DATE(startTime) ORDER BY call_date ASC;`;
}
