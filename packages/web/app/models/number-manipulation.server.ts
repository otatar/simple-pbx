import type { NumberManipulation, Prisma } from "~/prisma/client";
import db from "~/utils/db.server";

export async function checkNumberManipulation(trunkId: number, name: string) {
  const outboundNumberManipulation = await db.numberManipulation.findFirst({
    where: {
      trunkId,
      name,
    },
  });
  return outboundNumberManipulation;
}

export async function checkNumberManipulationPriority(trunkId: number, priority: number) {
  const outboundNumberManipulation = await db.numberManipulation.findFirst({
    where: {
      trunkId,
      priority,
    },
  });
  return outboundNumberManipulation;
}

export async function getNumberManipulation(id: number) {
  const numberManipulation = await db.numberManipulation.findUnique({
    where: {
      id,
    },
  });
  return numberManipulation;
}

export async function getNumberManipulations() {
  const numberManipulations = await db.numberManipulation.findMany({
    omit: { createdAt: true },
    include: {
      trunk: {
        select: {
          name: true,
        },
      },
    },
  });
  const flattenedNumberManipulations = numberManipulations.map((numMan) => {
    return {
      ...numMan,
      trunk: numMan.trunk.name,
    };
  });
  return flattenedNumberManipulations;
}

export async function getNumberManipulationForTrunk(
  trunkId: number,
  direction: "outbound" | "inbound"
) {
  const numberManipulation = await db.numberManipulation.findMany({
    where: {
      trunkId,
      direction,
    },
    orderBy: {
      priority: "asc",
    },
  });
  return numberManipulation;
}

export async function createNumberManipulation(
  numMan: Prisma.NumberManipulationUncheckedCreateInput
) {
  const numberManipulation = await db.numberManipulation.create({
    data: numMan,
  });
  return numberManipulation;
}

export async function updateNumberManipulation(numMan: Partial<NumberManipulation>) {
  const numberManipulation = await db.numberManipulation.update({
    where: {
      id: numMan.id,
    },
    data: numMan,
  });
  return numberManipulation;
}

export async function deleteNumberManipulation(id: number) {
  const numberManipulation = await db.numberManipulation.delete({
    where: {
      id,
    },
  });
  return numberManipulation;
}
