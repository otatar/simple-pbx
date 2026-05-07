import { getValidatedFormData } from "remix-hook-form";

import PhonebookEditor from "./phonebook-editor";
import { resolver, type FormData } from "./phonebook-editor";
import type { Route } from "./+types/new";
import { badRequest } from "~/utils/request.server";
import {
  checkExternalPhoneNumber,
  createExternalPhonebookEntry,
} from "~/models/phonebook.server";
import { redirectWithToast } from "~/utils/toast.server";
import CustomErrorBoundary from "~/components/custom-error-boundary";

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
    const existingEntry = await checkExternalPhoneNumber(receivedData.phoneNumber);
    if (existingEntry) {
      return badRequest({
        errors: {
          phoneNumber: "Phone number already exists",
        },
        defaultValues: receivedData,
      });
    }
    await createExternalPhonebookEntry({
      name: receivedData.name,
      phoneNumber: receivedData.phoneNumber,
      email: receivedData.email,
      company: receivedData.company,
      notes: receivedData.notes,
    });
    return redirectWithToast("/phonebook", {
      type: "success",
      title: "Success",
      description: "Contact created successfully",
    });
  } catch (e: any) {
    console.log(e);
    throw new Error("Database Error!");
  }
}

export default function NewPhonebookEntry({}: Route.ComponentProps) {
  return <PhonebookEditor />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return CustomErrorBoundary(error);
}
