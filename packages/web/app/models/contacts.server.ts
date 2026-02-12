import db from "~/utils/db.server";

export function getContacts() {
  return db.ps_contacts.findMany({});
}

export function getContact(id: string) {
  return db.ps_contacts.findFirst({
    where: { id },
  });
}
