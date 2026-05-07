import { getValidatedFormData } from "remix-hook-form";

import PhonebookEditor from "./phonebook-editor";
import { resolver, type FormData } from "./phonebook-editor";
import type { Route } from "./+types/$id";
import { badRequest } from "~/utils/request.server";
import {
  getExternalPhonebookEntry,
  updateExternalPhonebookEntry,
  deleteExternalPhonebookEntry,
  checkExternalPhoneNumber,
} from "~/models/phonebook.server";
import { redirectWithToast } from "~/utils/toast.server";
import CustomErrorBoundary from "~/components/custom-error-boundary";
import { redirect } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  const id = parseInt(params.id);
  const entry = await getExternalPhonebookEntry(id);
  if (!entry) {
    throw new Response("Not found", { status: 404 });
  }
  return { entry };
}

export async function action({ request, params }: Route.ActionArgs) {
  const id = parseInt(params.id);

  if (request.method === "DELETE") {
    try {
      await deleteExternalPhonebookEntry(id);
      return redirectWithToast("/phonebook", {
        type: "success",
        title: "Success",
        description: "Contact deleted successfully",
      });
    } catch (e: any) {
      console.log(e);
      throw new Error("Database Error!");
    }
  }

  const {
    errors,
    data: receivedData,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, resolver);
  if (errors) {
    return badRequest({ errors, defaultValues });
  }
  try {
    const existingEntry = await checkExternalPhoneNumber(receivedData.phoneNumber);
    if (existingEntry && existingEntry.id !== id) {
      return badRequest({
        errors: {
          phoneNumber: "Phone number already exists",
        },
        defaultValues: receivedData,
      });
    }
    await updateExternalPhonebookEntry(id, {
      name: receivedData.name,
      phoneNumber: receivedData.phoneNumber,
      email: receivedData.email,
      company: receivedData.company,
      notes: receivedData.notes,
    });
    return redirectWithToast("/phonebook", {
      type: "success",
      title: "Success",
      description: "Contact updated successfully",
    });
  } catch (e: any) {
    console.log(e);
    throw new Error("Database Error!");
  }
}

export default function EditPhonebookEntry({ loaderData }: Route.ComponentProps) {
  return <PhonebookEditor entry={loaderData.entry} />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return CustomErrorBoundary(error);
}
