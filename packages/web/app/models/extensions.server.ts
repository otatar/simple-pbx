import { Prisma, type Extension } from "~/prisma/client";
import db from "~/utils/db.server";

export function getExtensions() {
  /*return db.$queryRaw<
    (Awaited<ReturnType<typeof db.extension.findFirst>> & {
      template: string;
    })[]
  >`SELECT Extension.*, ExtensionTemplate.name as template FROM Extension LEFT JOIN ExtensionTemplate ON Extension.templateId = ExtensionTemplate.id`;
  */
  return db.extension.findMany({
    omit: {
      password: true,
    },
  });
}

export function checkExtension(extension: string) {
  return db.extension.findFirst({
    where: { extension },
  });
}

export async function getExtension(id: number) {
  const extension = await db.extension.findFirst({
    where: { id },
  });
  if (!extension) {
    return null;
  }
  const endpoint = await db.ps_endpoints.findFirst({
    where: { id: extension.extension },
    omit: { id: true },
  });

  const res = Object.assign(extension, endpoint);

  if (endpoint?.allow) {
    const codecs = endpoint.allow.split(",");
    return Object.assign(res, {
      codec_1: codecs[0],
      codec_2: codecs[1],
      codec_3: codecs[2],
      codec_4: codecs[3],
    });
  } else {
    return Object.assign(res, {
      codec_1: "",
      codec_2: "",
      codec_3: "",
      codec_4: "",
    });
  }
}

export async function createExtension(
  extension: Prisma.ExtensionUncheckedCreateInput &
    Omit<Prisma.ps_endpointsCreateInput, "id"> & {
      codec_1?: string;
      codec_2?: string;
      codec_3?: string;
      codec_4?: string;
    }
) {
  // We will use a transaction because we need to create more records in the database
  try {
    await db.$transaction([
      db.extension.create({
        data: {
          name: extension.name,
          extension: extension.extension,
          password: extension.password,
          email: extension.email,
          cos: { connect: { id: extension.cosId } },
          language: extension.language,
          callRecord: extension.callRecord,
          phoneBook: extension.phoneBook,
        },
      }),
      db.ps_aors.create({
        data: {
          id: extension.extension,
          max_contacts: 1,
        },
      }),
      db.ps_auths.create({
        data: {
          id: extension.extension,
          auth_type: "userpass",
          password: extension.password,
          username: extension.extension,
        },
      }),
      db.ps_endpoints.create({
        data: {
          id: extension.extension,
          callerid: extension.name + " <" + extension.extension + ">",
          transport: extension.transport,
          aors: extension.extension,
          auth: extension.extension,
          context: "internal",
          disallow: "all",
          allow: [extension.codec_1, extension.codec_2, extension.codec_3, extension.codec_4].join(
            ","
          ),
          dtmf_mode: extension.dtmf_mode,
          direct_media: extension.direct_media,
          ice_support: extension.ice_support,
          direct_media_method: extension.direct_media_method,
          rewrite_contact: extension.rewrite_contact,
          webrtc: extension.webrtc,
          send_pai: extension.send_pai,
          send_diversion: extension.send_diversion,
          send_rpid: extension.send_rpid,
        },
      }),
    ]);
  } catch (error) {
    console.error("Failed to create extension: " + error);
    throw new Error("Error creating extension");
  }
}

export async function updateExtension(
  extension: Partial<Extension> &
    Omit<Prisma.ps_endpointsUpdateInput, "id"> & {
      codec_1?: string;
      codec_2?: string;
      codec_3?: string;
      codec_4?: string;
    }
) {
  await db.extension.update({
    where: { id: extension.id },
    data: {
      name: extension.name,
      extension: extension.extension,
      password: extension.password,
      email: extension.email,
      cos: { connect: { id: extension.cosId } },
      language: extension.language,
      callRecord: extension.callRecord,
      phoneBook: extension.phoneBook,
    },
  });

  await db.ps_endpoints.update({
    where: { id: extension.extension },
    data: {
      id: extension.extension,
      callerid: extension.name + " <" + extension.extension + ">",
      transport: extension.transport,
      aors: extension.extension,
      auth: extension.extension,
      context: "internal",
      disallow: "all",
      allow: [extension.codec_1, extension.codec_2, extension.codec_3, extension.codec_4].join(","),
      dtmf_mode: extension.dtmf_mode,
      direct_media: extension.direct_media,
      ice_support: extension.ice_support,
      direct_media_method: extension.direct_media_method,
      rewrite_contact: extension.rewrite_contact,
      webrtc: extension.webrtc,
      send_pai: extension.send_pai,
      send_diversion: extension.send_diversion,
      send_rpid: extension.send_rpid,
    },
  });

  await db.ps_auths.update({
    where: { id: extension.extension },
    data: {
      auth_type: "userpass",
      password: extension.password,
      username: extension.extension,
    },
  });
}

export async function deleteExtension(id: number) {
  const extension = await db.extension.findFirst({
    where: { id },
  });
  if (!extension) {
    throw new Error("Extension not found");
  }
  try {
    await db.$transaction([
      db.extension.delete({
        where: { id },
      }),
      db.ps_aors.delete({
        where: { id: extension.extension },
      }),
      db.ps_auths.delete({
        where: { id: extension.extension },
      }),
      db.ps_endpoints.delete({
        where: { id: extension.extension },
      }),
    ]);
  } catch (error) {
    console.error("Failed to delete extension: " + error);
    throw new Error("Error deleting extension");
  }
}
