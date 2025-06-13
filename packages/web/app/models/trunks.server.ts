import type { Prisma, Trunk } from "@prisma/client";
import { db } from "~/utils/db.server";

export function getTrunks() {
  return db.trunk.findMany({});
}

export function checkTrunk(name: string) {
  return db.trunk.findFirst({
    where: { name },
  });
}

export async function getTrunk(id: number) {
  const trunk = await db.trunk.findFirst({
    where: { id },
  });
  if (!trunk) {
    return null;
  }
  const endpoint = await db.ps_endpoints.findFirst({
    where: { id: trunk.name },
    omit: { id: true },
  });

  const aor = await db.ps_aors.findFirst({
    where: { id: trunk.name },
    omit: { id: true },
  });

  const auth = await db.ps_auths.findFirst({
    where: { id: trunk.name },
    omit: { id: true },
  });

  const registration = await db.ps_registrations.findFirst({
    where: { id: trunk.name },
    omit: { id: true },
  });
  if (!endpoint || !aor || !auth || !registration) {
    console.error("Endpoint, AOR, Auth or Registration not found");
    return null;
  }
  // Merge the trunk and endpoint objects
  // and add the codec properties
  // to the merged object
  trunk.qualifyFrequency = aor.qualify_frequency;
  trunk.serverUri = registration.server_uri;
  trunk.clientUri = registration.client_uri;
  let res = Object.assign(trunk, endpoint);

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

export async function createTrunk(
  trunk: Prisma.TrunkUncheckedCreateInput &
    Omit<Prisma.ps_endpointsCreateInput, "id"> & {
      codec_1?: string;
      codec_2?: string;
      codec_3?: string;
      codec_4?: string;
    },
) {
  // We will use a transaction because we need to create more records in the database
  try {
    await db.$transaction([
      db.trunk.create({
        data: {
          name: trunk.name,
          provider: trunk.provider,
          host: trunk.host,
          port: trunk.port,
          username: trunk.username,
          password: trunk.password,
          registration: trunk.registration,
          serverUri: trunk.serverUri,
          clientUri: trunk.clientUri,
        },
      }),
      db.ps_aors.create({
        data: {
          id: trunk.name,
          qualify_frequency: trunk.qualifyFrequency,
          max_contacts: 1,
        },
      }),
      db.ps_auths.create({
        data: {
          id: trunk.name,
          auth_type: "userpass",
          password: trunk.password,
          username: trunk.username,
        },
      }),
      trunk.registration
        ? db.ps_registrations.create({
            data: {
              id: trunk.name,
              client_uri: trunk.clientUri,
              server_uri: trunk.serverUri,
              retry_interval: 60,
              outbound_auth: trunk.name,
              transport: trunk.transport,
            },
          })
        : db.ps_registrations.delete({
            where: { id: trunk.name },
          }),
      db.ps_endpoints.create({
        data: {
          id: trunk.name,
          transport: trunk.transport,
          aors: trunk.name,
          auth: trunk.name,
          context: "internal",
          disallow: "all",
          allow: [
            trunk.codec_1,
            trunk.codec_2,
            trunk.codec_3,
            trunk.codec_4,
          ].join(","),
          max_audio_streams: trunk.max_audio_streams,
          max_video_streams: trunk.max_video_streams,
          dtmf_mode: trunk.dtmf_mode,
          direct_media: trunk.direct_media,
          ice_support: trunk.ice_support,
          direct_media_method: trunk.direct_media_method,
          rewrite_contact: trunk.rewrite_contact,
          webrtc: trunk.webrtc,
          send_pai: trunk.send_pai,
          send_diversion: trunk.send_diversion,
          send_rpid: trunk.send_rpid,
        },
      }),
    ]);
  } catch (error) {
    console.error("Failed to create trunk: " + error);
    throw new Error("Error creating trunk");
  }
}

export async function updateTrunk(
  trunk: Partial<Trunk> &
    Omit<Prisma.ps_endpointsUpdateInput, "id"> &
    Omit<Prisma.ps_aorsCreateInput, "id"> & {
      codec_1?: string;
      codec_2?: string;
      codec_3?: string;
      codec_4?: string;
    },
) {
  // We will use a transaction because we need to create more records in the database
  try {
    await db.$transaction([
      db.trunk.update({
        where: { id: trunk.id },
        data: {
          name: trunk.name,
          provider: trunk.provider,
          host: trunk.host,
          port: trunk.port,
          username: trunk.username,
          password: trunk.password,
          registration: trunk.registration,
          serverUri: trunk.serverUri,
          clientUri: trunk.clientUri,
        },
      }),
      db.ps_aors.update({
        where: { id: trunk.name },
        data: {
          qualify_frequency: trunk.qualifyFrequency,
        },
      }),
      db.ps_auths.update({
        where: { id: trunk.name },
        data: {
          password: trunk.password,
          username: trunk.username,
        },
      }),
      trunk.registration
        ? db.ps_registrations.update({
            where: { id: trunk.name },
            data: {
              client_uri: trunk.clientUri,
              server_uri: trunk.serverUri,
              retry_interval: 60,
              outbound_auth: trunk.name,
              transport: trunk.transport,
            },
          })
        : db.ps_registrations.delete({
            where: { id: trunk.name },
          }),
      db.ps_endpoints.update({
        where: { id: trunk.name },
        data: {
          transport: trunk.transport,
          disallow: "all",
          allow: [
            trunk.codec_1,
            trunk.codec_2,
            trunk.codec_3,
            trunk.codec_4,
          ].join(","),
          max_audio_streams: trunk.max_audio_streams,
          max_video_streams: trunk.max_video_streams,
          dtmf_mode: trunk.dtmf_mode,
          direct_media: trunk.direct_media,
          ice_support: trunk.ice_support,
          direct_media_method: trunk.direct_media_method,
          rewrite_contact: trunk.rewrite_contact,
          webrtc: trunk.webrtc,
          send_pai: trunk.send_pai,
          send_diversion: trunk.send_diversion,
          send_rpid: trunk.send_rpid,
        },
      }),
    ]);
  } catch (error) {
    console.error("Failed to update trunk: " + error);
    throw new Error("Error updating trunk");
  }
}

export async function deleteTrunk(id: number) {
  const trunk = await db.trunk.findFirst({
    where: { id },
  });
  if (!trunk) {
    throw new Error("Trunk not found");
  }
  try {
    await db.$transaction([
      db.trunk.delete({
        where: { id },
      }),
      db.ps_aors.delete({
        where: { id: trunk.name },
      }),
      db.ps_auths.delete({
        where: { id: trunk.name },
      }),
      db.ps_endpoints.delete({
        where: { id: trunk.name },
      }),
    ]);
  } catch (error) {
    console.error("Failed to delete extension: " + error);
    throw new Error("Error deleting extension");
  }
}
