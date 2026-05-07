import type { Route } from "./+types/phonebook";
import { getPhonebookEntries, hideExtensionFromPhonebook } from "~/models/phonebook.server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { DataTable, generateColumnHeaders } from "~/components/data-table";
import { Pencil, Trash2 } from "lucide-react";
import { Outlet, useNavigate, useSubmit } from "react-router";
import { useState } from "react";
import DeleteAlert from "~/components/delete-alert";
import type { PhonebookEntry } from "~/models/phonebook.server";

const columnsArray = [
  { key: "name", title: "Name" },
  { key: "phoneNumber", title: "Phone Number" },
  { key: "email", title: "Email" },
  { key: "company", title: "Company" },
  { key: "contactType", title: "Contact Type" },
  { key: "createdAt", title: "Created" },
];

const columns = generateColumnHeaders(columnsArray);

export async function loader() {
  return await getPhonebookEntries();
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const actionType = formData.get("actionType");
  const id = formData.get("id");

  if (actionType === "hideExtension" && id) {
    await hideExtensionFromPhonebook(parseInt(id as string));
    return { success: true };
  }

  return null;
}

export default function Phonebook({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const submit = useSubmit();
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState("");
  const [selectedType, setSelectedType] = useState<"extension" | "external" | null>(null);
  const onNew = () => navigate("/phonebook/new");

  const serializedData = loaderData.map((entry) => ({
    ...entry,
    id: String(entry.id),
    contactType: entry.contactType.charAt(0).toUpperCase() + entry.contactType.slice(1),
    createdAt: entry.createdAt.toISOString(),
  }));

  const entryTypeMap = new Map<string, "extension" | "external">(
    loaderData.map((e) => [String(e.id), e.type]),
  );

  const onEdit = (id: string) => {
    const type = entryTypeMap.get(id);
    if (type === "extension") {
      navigate(`/extensions/${id}`);
    } else if (type === "external") {
      navigate(`/phonebook/${id}`);
    }
  };

  const onDelete = (id: string) => {
    const type = entryTypeMap.get(id);
    if (!type) return;

    setSelectedEntry(id);
    setSelectedType(type);
    setDeleteAlertOpen(true);
  };

  const onDeleteConfirmation = () => {
    if (selectedType === "extension") {
      submit(
        { actionType: "hideExtension", id: selectedEntry },
        { method: "post" },
      );
    } else {
      submit({}, { action: `/phonebook/${selectedEntry}`, method: "delete" });
    }
  };

  const isExtensionDelete = selectedType === "extension";

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Phonebook</CardTitle>
          <CardDescription>Internal extensions and external contacts</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={serializedData}
            onNew={onNew}
            actions={[
              { title: "Edit", cb: onEdit, icon: Pencil },
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
        title={isExtensionDelete ? "Remove from phonebook?" : "Delete confirmation?"}
        description={
          isExtensionDelete
            ? `This will remove extension with id: ${selectedEntry} from the phonebook. The extension itself will not be deleted.`
            : `This action cannot be undone. This will permanently delete contact with id: ${selectedEntry} from the database.`
        }
      />
      <Outlet />
    </div>
  );
}
