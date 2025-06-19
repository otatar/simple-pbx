import { redirectWithToast } from "~/utils/toast.server";
import { invariantResponse } from "@epic-web/invariant";
import { badRequest } from "~/utils/request.server";
import CustomErrorBoundary from "~/components/custom-error-boundary";
import { getValidatedFormData } from "remix-hook-form";
import { getTrunks } from "~/models/trunks.server";
import type { TrunkGroup } from "@prisma/client";
import InboundRouteEditor, { resolver, type FormData } from "./inbound-route-editor";
import type { Route } from "./+types/inbound-route";
import {
  checkInboundRoute,
  deleteInboundRoute,
  getInboundRoute,
  updateInboundRoute,
} from "~/models/inbound-routing.server";
import { getExtensions } from "~/models/extensions.server";

export async function loader({ request, params }: Route.LoaderArgs) {
  invariantResponse(params.id, "ID is required");
  const id = parseInt(params.id);
  const outboundRoute = await getInboundRoute(id);
  invariantResponse(outboundRoute, "Inbound route not found", { status: 404 });
  const trunks = await getTrunks();
  const extensions = await getExtensions();
  const trunkGroups = [] as TrunkGroup[];
  return { outboundRoute, trunks, extensions, trunkGroups };
}

export async function action({ request, params }: Route.ActionArgs) {
  if (request.method == "DELETE") {
    invariantResponse(params.id, "ID is required");
    const id = parseInt(params.id);
    await deleteInboundRoute(id);
    return redirectWithToast("/inbound-routing", {
      type: "success",
      title: "Success",
      description: "Inbound route deleted successfully",
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
      const existingRoute = await checkInboundRoute(receivedData.prefix);
      if (existingRoute) {
        return badRequest({
          errors: {
            prefix: "Route with that prefix already exists",
          },
          defaultValues: receivedData,
        });
      }
    }
    await updateInboundRoute(receivedData);
    return redirectWithToast("/inbound-routing", {
      type: "success",
      title: "Success",
      description: "Inbound route updated successfully",
    });
  }
}

export default function InboundRoute({ loaderData }: Route.ComponentProps) {
  return (
    <InboundRouteEditor
      route={loaderData.outboundRoute}
      trunks={loaderData.trunks}
      trunkGroups={loaderData.trunkGroups}
      extensions={loaderData.extensions}
    />
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return CustomErrorBoundary(error);
}
