import { getTrunks } from "~/models/trunks.server";
import InboundRouteEditor, {
  resolver,
  type FormData,
} from "./inbound-route-editor";
import { getCos } from "~/models/class-of-service.server";
import type { TrunkGroup } from "@prisma/client";
import type { Route } from "./+types/new";
import { getValidatedFormData } from "remix-hook-form";
import { badRequest } from "~/utils/request.server";
import { redirectWithToast } from "~/utils/toast.server";
import {
  checkInboundRoute,
  createInboundRoute,
} from "~/models/inbound-routing.server";

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
    const existingRoute = await checkInboundRoute(receivedData.prefix);
    if (existingRoute) {
      return badRequest({
        errors: {
          prefix: "Route with that prefix already exists",
        },
        defaultValues: receivedData,
      });
    }

    await createInboundRoute(receivedData);
    return redirectWithToast("/inbound-routing", {
      type: "success",
      title: "Success",
      description: "Inbound route created successfully",
    });
  } catch (e: any) {
    console.log(e);
    throw new Error("Database Error!");
  }
}

export default function NewInboundRouting({
  loaderData: { trunks, trunkGroups },
}: Route.ComponentProps) {
  return <InboundRouteEditor trunkGroups={trunkGroups} trunks={trunks} />;
}
