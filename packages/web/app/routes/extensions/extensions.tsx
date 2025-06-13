import { getExtensions } from "~/models/extensions.server";
import type { Route } from "./+types/extensions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { DataTable, generateColumnHeaders } from "~/components/data-table";
import { BookOpen, Trash2 } from "lucide-react";
import { Outlet, useNavigate, useSubmit } from "react-router";
import { useState } from "react";
import DeleteAlert from "~/components/delete-alert";

const columnsArray = [
  { key: "id", title: "ID" },
  { key: "name", title: "Name" },
  { key: "extension", title: "Extension" },
  { key: "email", title: "Email" },
  { key: "createdAt", title: "Created" },
];

const columns = generateColumnHeaders(columnsArray);

export async function loader() {
  return await getExtensions();
}

export default function Extensions({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const submit = useSubmit();
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState("");
  const onNew = () => navigate("/extensions/new");
  const onDelete = (id: string) => {
    setDeleteAlertOpen(true);
    setSelectedEntry(id);
  };
  const onDetails = (id: string) => navigate(`/extensions/${id}`);
  const onDeleteConfirmation = () => {
    submit({}, { action: `/extensions/${selectedEntry}`, method: "delete" });
  };

  const serializedData = loaderData.map((ext) => {
    return { ...ext, createdAt: ext.createdAt.toISOString() };
  });

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Extensions List</CardTitle>
          <CardDescription>A list of extensions</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={serializedData}
            onNew={onNew}
            actions={[
              { title: "Details", cb: onDetails, icon: BookOpen },
              {
                title: "Delete",
                cb: onDelete,
                icon: Trash2,
                iconColor: "destructive",
              },
            ]}
          />
        </CardContent>
      </Card>
      <DeleteAlert
        id={selectedEntry}
        open={deleteAlertOpen}
        onOpenChange={(o: boolean) => setDeleteAlertOpen(o)}
        onActionClick={onDeleteConfirmation}
      />
      <Outlet />
    </div>
  );
}
