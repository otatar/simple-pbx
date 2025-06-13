import { getTrunks } from "~/models/trunks.server";
import type { Route } from "./+types/num-manipulation-new";
import NumManEditor, { resolver, type FormData } from "./num-man-editor";
import { getValidatedFormData } from "remix-hook-form";
import { badRequest } from "~/utils/request.server";
import {
  checkNumberManipulation,
  checkNumberManipulationPriority,
  createNumberManipulation,
} from "~/models/number-manipulation.server";
import { redirectWithToast } from "~/utils/toast.server";

export async function loader() {
  // We need trunks
  const trunks = await getTrunks();
  return { trunks };
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
    const existingManipulationPriority = await checkNumberManipulationPriority(
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
    await createNumberManipulation(receivedData);
    return redirectWithToast("/number-manipulations", {
      type: "success",
      title: "Success",
      description: "Number manipulation created successfully",
    });
  } catch (e: any) {
    console.log(e);
    throw new Error("Database Error!");
  }
}

export default function NewNumberManipulation({
  loaderData,
}: Route.ComponentProps) {
  return <NumManEditor trunks={loaderData.trunks} />;
}
