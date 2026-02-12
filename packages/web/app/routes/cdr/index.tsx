import { BookOpen } from "lucide-react";
import { Outlet, useNavigate, useSubmit } from "react-router";
import { DataTable, generateColumnHeaders } from "~/components/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import type { Route } from "./+types";
import { getCDRs } from "~/models/cdr.server";

const columnsArray = [
  { key: "id", title: "ID" },
  { key: "origANumber", title: "Orig A Number" },
  { key: "origBNumber", title: "Orig B Number" },
  { key: "startTime", title: "Call Start" },
  { key: "duration", title: "Duration" },
  { key: "sourceType", title: "Call Source" },
  { key: "destinationType", title: "Call Destination" },
  { key: "sourceTrunk", title: "Source Trunk" },
  { key: "destinationTrunk", title: "Destination Trunk" },
];

const columns = generateColumnHeaders(columnsArray);

export async function loader() {
  return await getCDRs();
}

export default function CDR({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const onDetails = (id: string) => navigate(`/cdr/${id}`);
  const serializedData = loaderData.map((ext) => {
    return { ...ext, startTime: ext.startTime.toISOString() };
  });

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>CDR List</CardTitle>
          <CardDescription>Call Detail Records</CardDescription>
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
