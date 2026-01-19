import type { Prisma } from "~/prisma/client";
import db from "~/utils/db.server";
import bcrypt from "bcryptjs";

export default function getUsers() {
  return db.webUser.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      role: true,
    },
  });
}

export const getUserByUsername = async (email: string) => {
  const user = await db.webUser.findUnique({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      passwordChanged: true,
    },
    where: { email },
  });

  return user;
};

export const getUser = async (id: number) => {
  const user = await db.webUser.findUnique({
    where: { id },
  });
  return user;
};

export const createUser = async (user: Prisma.WebUserCreateInput) => {
  return await db.webUser.create({
    data: {
      ...user,
      password: bcrypt.hashSync(user.password),
    },
  });
};

export const updateUser = async (user: Prisma.WebUserUpdateInput) => {
  return await db.webUser.update({
    where: {
      email: user.email?.toString(),
    },
    data: user,
  });
};

export const changePassword = async (
  id: number,
  password: string,
  setChangePassword: boolean = true
) => {
  return await db.webUser.update({
    where: {
      id,
    },
    data: { password, passwordChanged: setChangePassword },
  });
};

export const deleteUser = async (id: string) => {
  return await db.webUser.delete({ where: { id: parseInt(id) } });
};

export const setLastLogIn = async (id: number) => {
  return await db.webUser.update({ where: { id }, data: { lastLoginAt: new Date() } });
};
