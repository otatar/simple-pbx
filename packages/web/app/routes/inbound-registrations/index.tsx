import { getContacts } from "~/models/contacts.server";
import type { Route } from "./+types";
import { Outlet, useNavigate, useRevalidator } from "react-router";
import { DataTable, generateColumnHeaders } from "~/components/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { BookOpen } from "lucide-react";
import { useEffect } from "react";

const columnsArray = [
  { key: "id", title: "ID" },
  { key: "endpoint", title: "Extension" },
  { key: "uri", title: "Contact URI" },
  { key: "expiration_time", title: "Expires" },
  { key: "user_agent", title: "User Agent" },
];

const columns = generateColumnHeaders(columnsArray);

export async function loader() {
  return await getContacts();
}

export default function Registrations({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  useEffect(() => {
    // Set up an interval to refresh every 30 seconds
    const interval = setInterval(() => {
      // Only revalidate if the document is visible and not already loading
      if (document.visibilityState === "visible" && revalidator.state === "idle") {
        revalidator.revalidate();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [revalidator]);

  const onDetails = (id: string) => navigate(`/inbound-registrations/${id}`);
  const serializedData = loaderData.map((contact) => {
    return {
      ...contact,
      expiration_time: new Date(Number(contact.expiration_time!) * 1000).toLocaleString(),
    };
  });
  console.log("loaderData", loaderData);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Extension Registration List</CardTitle>
          <CardDescription>Registrations from extensions</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={serializedData}
            actions={[{ title: "Details", cb: onDetails, icon: BookOpen }]}
          />
        </CardContent>
      </Card>
      <Outlet />
    </div>
  );
}
