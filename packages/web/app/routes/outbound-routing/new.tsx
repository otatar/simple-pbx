import { getTrunks } from "~/models/trunks.server";
import OutboundRouteEditor, {
  resolver,
  type FormData,
} from "./outbound-route-editor";
import { getCos } from "~/models/class-of-service.server";
import type { TrunkGroup } from "@prisma/client";
import type { Route } from "./+types/new";
import { getValidatedFormData } from "remix-hook-form";
import { badRequest } from "~/utils/request.server";
import {
  checkOutboundRoute,
  createOutboundRoute,
} from "~/models/outbound-routing.server";
import { redirectWithToast } from "~/utils/toast.server";

export async function loader() {
  const trunks = await getTrunks();
  const trunkGroups = [] as TrunkGroup[];
  const coss = await getCos();

  return {
    trunks,
    trunkGroups,
    coss,
  };
}

export async function action({ request }: Route.ActionArgs) {
  const {
    errors,
    data: receivedData,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, resolver);
  if (errors) {
    return badRequest({ errors, defaultValues });
  }
  try {
    const existingRoute = await checkOutboundRoute(receivedData.prefix);
    if (existingRoute) {
      return badRequest({
        errors: {
          prefix: "Route with that prefix already exists",
        },
        defaultValues: receivedData,
      });
    }

    await createOutboundRoute(receivedData);
    return redirectWithToast("/outbound-routing", {
      type: "success",
      title: "Success",
      description: "Outbound route created successfully",
    });
  } catch (e: any) {
    console.log(e);
    throw new Error("Database Error!");
  }
}

export default function NewOutboundRouting({
  loaderData: { trunks, trunkGroups, coss },
}: Route.ComponentProps) {
  return (
    <OutboundRouteEditor
      trunkGroups={trunkGroups}
      trunks={trunks}
      coss={coss}
    />
  );
}
