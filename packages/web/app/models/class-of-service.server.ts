import type { Prisma } from "@prisma/client";
import { db } from "~/utils/db.server";

export async function getCos() {
  return await db.classOfService.findMany();
}

export async function getCosById(id: number) {
  return await db.classOfService.findFirst({
    where: { id },
  });
}

export async function checkCos(cos: number) {
  return await db.classOfService.findFirst({
    where: { cos },
  });
}

export async function createCos(
  cos: Omit<Prisma.ClassOfServiceUncheckedCreateInput, "id">,
) {
  return await db.classOfService.create({
    data: cos,
  });
}

export async function updateCos(
  cos: Prisma.ClassOfServiceUncheckedUpdateInput,
) {
  return await db.classOfService.update({
    where: { id: Number(cos.id) },
    data: cos,
  });
}
export async function deleteCos(id: number) {
  return await db.classOfService.delete({
    where: { id },
  });
}
