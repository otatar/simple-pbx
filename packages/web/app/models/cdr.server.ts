import { db } from "~/utils/db.server";

export async function getCDRs() {
  const cdrs = await db.cdr.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return cdrs;
}
