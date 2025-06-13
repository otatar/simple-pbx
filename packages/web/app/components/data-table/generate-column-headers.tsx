import { type ColumnDef } from "@tanstack/react-table";
import DataTableColumnHeader from "./data-table-column-header";

type DataTableData = Record<string, string | number | null | undefined>;

export function generateColumnHeaders(headers: { key: string; title: string }[]) {
  const columns: ColumnDef<DataTableData>[] = headers.map((header) => ({
    accessorKey: header.key,
    header: ({ column }) => <DataTableColumnHeader column={column} title={header.title} />,
    cell: ({ row }) => <div className="text-center">{row.getValue(header.key)}</div>,
  }));

  return columns;
}
