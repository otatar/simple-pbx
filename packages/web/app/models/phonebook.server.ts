import { type ExternalPhonebook, type ContactType } from "~/prisma/client";
import db from "~/utils/db.server";

export type PhonebookEntry = {
  id: number | string;
  name: string;
  phoneNumber: string;
  email: string;
  company: string;
  notes: string;
  contactType: string;
  type: "extension" | "external";
  createdAt: Date;
};

export async function getPhonebookEntries(): Promise<PhonebookEntry[]> {
  const extensions = await db.extension.findMany({
    where: { phoneBook: "yes" },
    select: {
      id: true,
      name: true,
      extension: true,
      email: true,
      createdAt: true,
    },
  });

  const externalContacts = await db.externalPhonebook.findMany({
    select: {
      id: true,
      name: true,
      phoneNumber: true,
      email: true,
      company: true,
      notes: true,
      contactType: true,
      createdAt: true,
    },
  });

  const extensionEntries: PhonebookEntry[] = extensions.map((ext) => ({
    id: ext.id,
    name: ext.name || "",
    phoneNumber: ext.extension,
    email: ext.email || "",
    company: "",
    notes: "",
    contactType: "Extension",
    type: "extension" as const,
    createdAt: ext.createdAt,
  }));

  const externalEntries: PhonebookEntry[] = externalContacts.map((ext) => ({
    id: ext.id,
    name: ext.name,
    phoneNumber: ext.phoneNumber,
    email: ext.email || "",
    company: ext.company || "",
    notes: ext.notes || "",
    contactType: ext.contactType,
    type: "external" as const,
    createdAt: ext.createdAt,
  }));

  return [...extensionEntries, ...externalEntries].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

export async function getExternalPhonebookEntry(
  id: number,
): Promise<ExternalPhonebook | null> {
  return db.externalPhonebook.findFirst({
    where: { id },
  });
}

export async function createExternalPhonebookEntry(
  data: {
    name: string;
    phoneNumber: string;
    email?: string;
    company?: string;
    notes?: string;
    contactType: ContactType;
  },
  createdBy?: string,
): Promise<ExternalPhonebook> {
  return db.externalPhonebook.create({
    data: {
      name: data.name,
      phoneNumber: data.phoneNumber,
      email: data.email || "",
      company: data.company || "",
      notes: data.notes || "",
      contactType: data.contactType,
      createdBy,
    },
  });
}

export async function updateExternalPhonebookEntry(
  id: number,
  data: {
    name: string;
    phoneNumber: string;
    email?: string;
    company?: string;
    notes?: string;
    contactType: ContactType;
  },
): Promise<ExternalPhonebook> {
  return db.externalPhonebook.update({
    where: { id },
    data: {
      name: data.name,
      phoneNumber: data.phoneNumber,
      email: data.email || "",
      company: data.company || "",
      notes: data.notes || "",
      contactType: data.contactType,
    },
  });
}

export async function deleteExternalPhonebookEntry(
  id: number,
): Promise<void> {
  const entry = await db.externalPhonebook.findFirst({
    where: { id },
  });
  if (!entry) {
    throw new Error("Phonebook entry not found");
  }
  await db.externalPhonebook.delete({
    where: { id },
  });
}

export async function checkExternalPhoneNumber(
  phoneNumber: string,
): Promise<ExternalPhonebook | null> {
  return db.externalPhonebook.findFirst({
    where: { phoneNumber },
  });
}

export async function hideExtensionFromPhonebook(id: number): Promise<void> {
  const extension = await db.extension.findFirst({
    where: { id },
  });
  if (!extension) {
    throw new Error("Extension not found");
  }
  await db.extension.update({
    where: { id },
    data: { phoneBook: "no" },
  });
}
