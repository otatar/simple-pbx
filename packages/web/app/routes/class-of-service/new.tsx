import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import ClassOfServiceEditor, {
  resolver,
  type FormData,
} from "./class-of-service-editor";
import type { Route } from "./+types/new";
import { getValidatedFormData } from "remix-hook-form";
import { badRequest } from "~/utils/request.server";
import { checkCos, createCos } from "~/models/class-of-service.server";
import { redirectWithToast } from "~/utils/toast.server";

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
    const existingCos = await checkCos(receivedData.cos);
    if (existingCos) {
      return badRequest({
        errors: {
          name: "Class of Service already exists",
        },
        defaultValues: receivedData,
      });
    }

    const created = await createCos(receivedData);
    return redirectWithToast("/class-of-service/" + created.id, {
      type: "success",
      title: "Success",
      description: "Class of Service created successfully",
    });
  } catch (e: any) {
    console.log(e);
    throw new Error("Database Error!");
  }
}

export default function NewClassOfService() {
  return (
    <Card className="p-2">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Create Class of Service</CardTitle>
      </CardHeader>
      <CardContent>
        <ClassOfServiceEditor />
      </CardContent>
    </Card>
  );
}
