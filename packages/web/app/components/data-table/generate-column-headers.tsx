import { type ColumnDef } from "@tanstack/react-table";
import DataTableColumnHeader from "./data-table-column-header";
import { SquareCheck, SquareX } from "lucide-react";

type DataTableData = Record<string, string | number | bigint | boolean | null | undefined>;

export function generateColumnHeaders(
  headers: { key: string; title: string; isBoolean?: boolean }[],
) {
  const columns: ColumnDef<DataTableData>[] = headers.map((header) => ({
    accessorKey: header.key,
    header: ({ column }) => <DataTableColumnHeader column={column} title={header.title} />,
    cell: ({ row }) => {
      let retValue;
      if (header.isBoolean) {
        retValue = row.getValue(header.key) ? (
          <div className="flex justify-center text-center">
            <SquareCheck className="h-4 w-4 text-chart-2" />
          </div>
        ) : (
          <div className="flex justify-center text-center">
            <SquareX className="h-4 w-4 text-destructive" />
          </div>
        );
      } else {
        retValue = <div className="text-center">{row.getValue(header.key)}</div>;
      }
      return retValue;
    },
  }));

  return columns;
}
