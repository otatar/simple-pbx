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
