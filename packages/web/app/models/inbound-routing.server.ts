import type { IncomingRoute, Prisma } from "@prisma/client";
import { db } from "~/utils/db.server";

export async function getInboundRoutes() {
  const routes = await db.incomingRoute.findMany({
    include: {
      trunk: {
        select: {
          name: true,
        },
      },
      trunkGroup: {
        select: {
          name: true,
        },
      },
    },
  });

  const flattenedRoutes = routes.map((route) => {
    return {
      ...route,
      trunk: route.trunk ? route.trunk.name : null,
      trunkGroup: route.trunkGroup ? route.trunkGroup.name : null,
    };
  });

  return flattenedRoutes;
}

export async function checkInboundRoute(prefix: string) {
  return await db.incomingRoute.findFirst({
    where: {
      prefix: prefix,
    },
  });
}

export async function getInboundRoute(id: number) {
  return await db.incomingRoute.findUnique({
    where: {
      id: id,
    },
  });
}

export async function createInboundRoute(
  route: Prisma.IncomingRouteUncheckedCreateInput,
) {
  return await db.incomingRoute.create({
    data: {
      name: route.name,
      prefix: route.prefix,
      destinationType: route.destinationType,
      trunk: route.trunkId ? { connect: { id: route.trunkId } } : undefined,
      trunkGroup: route.trunkGroupId
        ? { connect: { id: route.trunkGroupId } }
        : undefined,
    },
  });
}

export async function updateInboundRoute(data: Partial<IncomingRoute>) {
  return await db.incomingRoute.update({
    where: {
      id: data.id,
    },
    data: data,
  });
}

export async function deleteInboundRoute(id: number) {
  return await db.incomingRoute.delete({
    where: {
      id: id,
    },
  });
}
