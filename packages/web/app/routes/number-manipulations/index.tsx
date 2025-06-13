import type { Route } from "./+types/index";
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
import { getNumberManipulations } from "~/models/number-manipulation.server";

const columnsArray = [
  { key: "id", title: "ID" },
  { key: "name", title: "Name" },
  { key: "trunk", title: "Trunk" },
  { key: "direction", title: "Direction" },
  { key: "type", title: "Type" },
  { key: "priority", title: "Priority" },
  { key: "match", title: "Match" },
  { key: "stripBegin", title: "Strip Begin" },
  { key: "stripEnd", title: "Strip End" },
  { key: "prepend", title: "Prepend" },
  { key: "append", title: "Append" },
];

const columns = generateColumnHeaders(columnsArray);

export async function loader() {
  return await getNumberManipulations();
}

export default function NumberTranslations({
  loaderData,
}: Route.ComponentProps) {
  const navigate = useNavigate();
  const submit = useSubmit();
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState("");
  const onNew = () => navigate("/number-manipulations/new");
  const onDelete = (id: string) => {
    setDeleteAlertOpen(true);
    setSelectedEntry(id);
  };
  const onDetails = (id: string) => navigate(`/number-manipulations/${id}`);
  const onDeleteConfirmation = () => {
    submit(
      {},
      { action: `/number-manipulations/${selectedEntry}`, method: "delete" },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Number Manipulations</CardTitle>
          <CardDescription>A list of number manipulations</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={loaderData}
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
