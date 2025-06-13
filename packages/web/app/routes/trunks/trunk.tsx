import { invariantResponse } from "@epic-web/invariant";
import type { Route } from "./+types/trunk";
import { deleteTrunk, getTrunk, updateTrunk } from "~/models/trunks.server";
import { redirectWithToast } from "~/utils/toast.server";
import { getValidatedFormData } from "remix-hook-form";
import { badRequest } from "~/utils/request.server";
import TrunkEditor, { resolver, type FormData } from "./trunk-editor";
import CustomErrorBoundary from "~/components/custom-error-boundary";
import { getNumberManipulationForTrunk } from "~/models/number-manipulation.server";

export async function loader({ params }: Route.LoaderArgs) {
  invariantResponse(params.id, "ID is required");
  const id = parseInt(params.id);
  const trunk = await getTrunk(id);
  const outboundNumMan = await getNumberManipulationForTrunk(id, "outbound");
  invariantResponse(trunk, "Trunk not found", { status: 404 });
  return { trunk, outboundNumMan };
}

export async function action({ request, params }: Route.ActionArgs) {
  if (request.method == "DELETE") {
    invariantResponse(params.id, "ID is required");
    const id = parseInt(params.id);
    await deleteTrunk(id);
    return redirectWithToast("/trunks", {
      type: "success",
      title: "Success",
      description: "Trunk deleted successfully",
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
    await updateTrunk(receivedData);
    return redirectWithToast("/trunks", {
      type: "success",
      title: "Success",
      description: "Trunk updated successfully",
    });
  }
}

export default function Trunk({ loaderData }: Route.ComponentProps) {
  return (
    <TrunkEditor
      trunk={loaderData.trunk}
      numberManipulations={loaderData.outboundNumMan}
    />
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return CustomErrorBoundary(error);
}
