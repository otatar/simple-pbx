import { redirectWithToast } from "~/utils/toast.server";
import { invariantResponse } from "@epic-web/invariant";
import { badRequest } from "~/utils/request.server";
import CustomErrorBoundary from "~/components/custom-error-boundary";
import { getValidatedFormData } from "remix-hook-form";
import { getCos } from "~/models/class-of-service.server";
import {
  checkOutboundRoute,
  deleteOutboundRoute,
  getOutboundRoute,
  updateOutboundRoute,
} from "~/models/outbound-routing.server";
import { getTrunks } from "~/models/trunks.server";
import type { TrunkGroup } from "@prisma/client";
import OutboundRouteEditor, {
  resolver,
  type FormData,
} from "./outbound-route-editor";
import type { Route } from "./+types/outbound-route";

export async function loader({ request, params }: Route.LoaderArgs) {
  invariantResponse(params.id, "ID is required");
  const id = parseInt(params.id);
  const outboundRoute = await getOutboundRoute(id);
  invariantResponse(outboundRoute, "Outbound route not found", { status: 404 });
  const trunks = await getTrunks();
  const trunkGroups = [] as TrunkGroup[];
  const coss = await getCos();
  return { outboundRoute, trunks, trunkGroups, coss };
}

export async function action({ request, params }: Route.ActionArgs) {
  if (request.method == "DELETE") {
    invariantResponse(params.id, "ID is required");
    const id = parseInt(params.id);
    await deleteOutboundRoute(id);
    return redirectWithToast("/outbound-routing", {
      type: "success",
      title: "Success",
      description: "Outbound route deleted successfully",
    });
  } else if (request.method == "PUT") {
    const {
      errors,
      data: receivedData,
      receivedValues: defaultValues,
    } = await getValidatedFormData<FormData>(request, resolver);
    if (errors) {
      return badRequest({ errors, defaultValues });
    }
    if (receivedData.prefix !== defaultValues.prefix) {
      const existingRoute = await checkOutboundRoute(receivedData.prefix);
      if (existingRoute) {
        return badRequest({
          errors: {
            prefix: "Route with that prefix already exists",
          },
          defaultValues: receivedData,
        });
      }
    }
    await updateOutboundRoute(receivedData);
    return redirectWithToast("/outbound-routing", {
      type: "success",
      title: "Success",
      description: "Outbound route updated successfully",
    });
  }
}

export default function Extension({ loaderData }: Route.ComponentProps) {
  return (
    <OutboundRouteEditor
      route={loaderData.outboundRoute}
      coss={loaderData.coss}
      trunks={loaderData.trunks}
      trunkGroups={loaderData.trunkGroups}
    />
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return CustomErrorBoundary(error);
}
