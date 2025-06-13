import { PrismaClient } from "@prisma/client";

const singleton = <Value>(name: string, valueFactory: () => Value): Value => {
  const g = global as any;
  g.__singletons ??= {};
  g.__singletons[name] ??= valueFactory();
  return g.__singletons[name];
};

export const db = singleton("prisma", () => new PrismaClient());
