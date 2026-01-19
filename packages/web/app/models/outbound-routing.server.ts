import type { OutgoingRoute, Prisma } from "~/prisma/client";
import db from "~/utils/db.server";

export async function getOutboundRoutes() {
  const routes = await db.outgoingRoute.findMany({
    include: {
      cos: {
        select: {
          name: true,
        },
      },
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
      cos: route.cos.name,
      trunk: route.trunk ? route.trunk.name : null,
      trunkGroup: route.trunkGroup ? route.trunkGroup.name : null,
    };
  });

  return flattenedRoutes;
}

export async function checkOutboundRoute(prefix: string) {
  return await db.outgoingRoute.findFirst({
    where: {
      prefix: prefix,
    },
  });
}

export async function getOutboundRoute(id: number) {
  return await db.outgoingRoute.findUnique({
    where: {
      id: id,
    },
  });
}

export async function createOutboundRoute(route: Prisma.OutgoingRouteUncheckedCreateInput) {
  return await db.outgoingRoute.create({
    data: {
      name: route.name,
      prefix: route.prefix,
      destinationType: route.destinationType,
      cos: { connect: { id: route.cosId } },
      trunk: route.trunkId ? { connect: { id: route.trunkId } } : undefined,
      trunkGroup: route.trunkGroupId ? { connect: { id: route.trunkGroupId } } : undefined,
    },
  });
}

export async function updateOutboundRoute(data: Partial<OutgoingRoute>) {
  return await db.outgoingRoute.update({
    where: {
      id: data.id,
    },
    data: data,
  });
}

export async function deleteOutboundRoute(id: number) {
  return await db.outgoingRoute.delete({
    where: {
      id: id,
    },
  });
}
