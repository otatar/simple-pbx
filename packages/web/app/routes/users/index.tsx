import { DataTable, generateColumnHeaders } from "~/components/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import getUsers from "~/models/ users.server";
import type { Route } from "./+types";
import { Outlet, useNavigate, useSubmit } from "react-router";
import { useState } from "react";
import { BookOpen, Trash2 } from "lucide-react";
import DeleteAlert from "~/components/delete-alert";

const columnsArray = [
  { key: "id", title: "ID" },
  { key: "email", title: "E-mail" },
  { key: "firstName", title: "First Name" },
  { key: "lastName", title: "Last Name" },
  { key: "role", title: "Role" },
  { key: "createdAt", title: "Created" },
];

const columns = generateColumnHeaders(columnsArray);

export async function loader() {
  return await getUsers();
}

export default function Users({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const submit = useSubmit();
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState("");
  const onNew = () => navigate("/users/new");
  const onDelete = (id: string) => {
    setDeleteAlertOpen(true);
    setSelectedEntry(id);
  };
  const onDetails = (id: string) => navigate(`/users/${id}`);
  const onDeleteConfirmation = () => {
    submit({}, { action: `/users/${selectedEntry}`, method: "delete" });
  };

  const serializedData = loaderData.map((usr) => {
    return { ...usr, createdAt: usr.createdAt.toISOString() };
  });
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
          <CardDescription></CardDescription>
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
