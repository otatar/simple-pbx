import type { Route } from "./+types/trunks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { DataTable, generateColumnHeaders } from "~/components/data-table";
import { BookOpen, Trash2 } from "lucide-react";
import { useNavigate, useSubmit } from "react-router";
import { useState } from "react";
import DeleteAlert from "~/components/delete-alert";
import { getTrunks } from "~/models/trunks.server";

const columnsArray = [
  { key: "id", title: "ID" },
  { key: "name", title: "Name" },
  { key: "provider", title: "Provider" },
  { key: "host", title: "Host" },
  { key: "port", title: "Port" },
  { key: "createdAt", title: "Created" },
];

const columns = generateColumnHeaders(columnsArray);

export async function loader() {
  return await getTrunks();
}

export default function Trunks({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const submit = useSubmit();
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState("");
  const onNew = () => navigate("/trunks/new");
  const onDelete = (id: string) => {
    setDeleteAlertOpen(true);
    setSelectedEntry(id);
  };
  const onDetails = (id: string) => navigate(`/trunks/${id}`);
  const onDeleteConfirmation = () => {
    submit({}, { action: `/trunks/${selectedEntry}`, method: "delete" });
  };

  const serializedData = loaderData.map((ext) => {
    return { ...ext, createdAt: ext.createdAt.toISOString() };
  });

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Trunk List</CardTitle>
          <CardDescription>A list of trunks</CardDescription>
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
    </div>
  );
}
