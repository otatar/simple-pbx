import { invariantResponse } from "@epic-web/invariant";
import {
  deleteCos,
  getCosById,
  updateCos,
} from "~/models/class-of-service.server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import ClassOfServiceEditor, {
  resolver,
  type FormData,
} from "./class-of-service-editor";
import type { Route } from "./+types/cos";
import { getValidatedFormData } from "remix-hook-form";
import { badRequest } from "~/utils/request.server";
import { redirectWithToast } from "~/utils/toast.server";
import { useSubmit } from "react-router";
import { useState } from "react";
import DeleteAlert from "~/components/delete-alert";

export async function loader({ params }: Route.LoaderArgs) {
  invariantResponse(params.id, "ID is required");
  const cos = await getCosById(Number(params.id));
  invariantResponse(cos, "Class of Service not found", {
    status: 404,
  });
  return cos;
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
      await updateCos(receivedData);
      return redirectWithToast(`/class-of-service/` + receivedData.id, {
        type: "success",
        title: "Success",
        description: "Class of Service updated successfully",
      });
    } catch (e: any) {
      console.log(e);
      throw new Error("Database Error!");
    }
  } else if (request.method === "DELETE") {
    invariantResponse(params.id, "ID is required");
    await deleteCos(Number(params.id));
    return redirectWithToast("/class-of-service", {
      type: "success",
      title: "Success",
      description: "Class of Service deleted successfully",
    });
  }
}

export default function ClassOfService({ loaderData }: Route.ComponentProps) {
  const submit = useSubmit();
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const onDelete = (id: number) => {
    setDeleteAlertOpen(true);
  };
  const onDeleteConfirmation = () => {
    submit(
      {},
      { action: `/class-of-service/${loaderData.id}`, method: "delete" },
    );
  };
  return (
    <Card className="p-2">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Edit Class of Service</CardTitle>
      </CardHeader>
      <CardContent>
        <ClassOfServiceEditor cos={loaderData} onDelete={onDelete} />
      </CardContent>
      <DeleteAlert
        id={loaderData.id.toString()}
        open={deleteAlertOpen}
        onOpenChange={(o: boolean) => setDeleteAlertOpen(o)}
        onActionClick={onDeleteConfirmation}
      />
    </Card>
  );
}
