import { getValidatedFormData } from "remix-hook-form";
import NumManEditor, { resolver, type FormData } from "./num-man-editor";
import { badRequest } from "~/utils/request.server";
import {
  checkNumberManipulation,
  checkNumberManipulationPriority,
  deleteNumberManipulation,
  getNumberManipulation,
  updateNumberManipulation,
} from "~/models/number-manipulation.server";
import type { Route } from "./+types/num-manipulation";
import { invariantResponse } from "@epic-web/invariant";
import { getTrunks } from "~/models/trunks.server";
import { redirectWithToast } from "~/utils/toast.server";

export async function loader({ request, params }: Route.LoaderArgs) {
  invariantResponse(params.id, "ID is required");
  const numberManipulation = await getNumberManipulation(Number(params.id));
  invariantResponse(numberManipulation, "Number manipulation not found", {
    status: 404,
  });
  // We need trunks
  const trunks = await getTrunks();
  return { trunks, numberManipulation };
}

export async function action({ request, params }: Route.ActionArgs) {
  if (request.method === "PUT") {
    const {
      errors,
      data: receivedData,
      receivedValues: defaultValues,
    } = await getValidatedFormData<FormData>(request, resolver);
    if (errors) {
      return badRequest({ errors, defaultValues });
    }
    try {
      if (receivedData.name !== defaultValues.name) {
        const existingManipulation = await checkNumberManipulation(
          receivedData.trunkId,
          receivedData.name,
        );
        if (existingManipulation) {
          return badRequest({
            errors: {
              name: "Number manipulation already exists",
            },
            defaultValues: receivedData,
          });
        }
      }
      if (receivedData.priority !== defaultValues.priority) {
        const existingManipulationPriority =
          await checkNumberManipulationPriority(
            receivedData.trunkId,
            receivedData.priority,
          );
        if (existingManipulationPriority) {
          return badRequest({
            errors: {
              priority: "Number manipulation with priority already exists",
            },
            defaultValues: receivedData,
          });
        }
      }
      await updateNumberManipulation(receivedData);
      return redirectWithToast(`/number-manipulations`, {
        type: "success",
        title: "Success",
        description: "Number manipulation updated successfully",
      });
    } catch (e: any) {
      console.log(e);
      throw new Error("Database Error!");
    }
  } else if (request.method === "DELETE") {
    invariantResponse(params.id, "ID is required");
    await deleteNumberManipulation(Number(params.id));
    return redirectWithToast("/number-manipulations", {
      type: "success",
      title: "Success",
      description: "Number manipulation deleted successfully",
    });
  }
}

export default function NumberManipulation({
  loaderData,
}: Route.ComponentProps) {
  return (
    <NumManEditor
      trunks={loaderData.trunks}
      numberManipulation={loaderData.numberManipulation}
    />
  );
}
