import { PrismaClient } from "~/prisma/client";
import { mockDeep, mockReset } from "vitest-mock-extended";

beforeEach(() => {
  mockReset(db);
});

export const db = mockDeep<PrismaClient>();
