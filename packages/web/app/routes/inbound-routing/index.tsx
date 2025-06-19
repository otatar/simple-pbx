import { BookOpen, Trash2 } from "lucide-react";
import { Outlet, useNavigate, useSubmit } from "react-router";
import { DataTable, generateColumnHeaders } from "~/components/data-table";
import DeleteAlert from "~/components/delete-alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import type { Route } from "./+types";
import { useState } from "react";
import { getInboundRoutes } from "~/models/inbound-routing.server";

const columnsArray = [
  { key: "id", title: "ID" },
  { key: "name", title: "Name" },
  { key: "prefix", title: "Prefix" },
  { key: "destinationType", title: "Destination Type" },
  { key: "trunk", title: "Trunk" },
  { key: "extension", title: "Extension" },
];

const columns = generateColumnHeaders(columnsArray);

export async function loader() {
  return await getInboundRoutes();
}

export default function InboundRouting({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const submit = useSubmit();
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState("");
  const onNew = () => navigate("/inbound-routing/new");
  const onDelete = (id: string) => {
    setDeleteAlertOpen(true);
    setSelectedEntry(id);
  };
  const onDetails = (id: string) => navigate(`/inbound-routing/${id}`);
  const onDeleteConfirmation = () => {
    submit({}, { action: `/inbound-routing/${selectedEntry}`, method: "delete" });
  };
  const serializedData = loaderData.map((ext) => {
    return { ...ext, createdAt: ext.createdAt.toISOString() };
  });
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Inbound Routes List</CardTitle>
          <CardDescription>A list of inbound routes</CardDescription>
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
