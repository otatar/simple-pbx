import { BookOpen, Trash2 } from "lucide-react";
import { Link, useSubmit } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export interface NumberManipulationTableProps {
  manipulationData: Record<string, string | number | Date | undefined | null>[];
  headers: { title: string; value: string }[];
}
export default function NumberManipulationTable({
  manipulationData,
  headers,
}: NumberManipulationTableProps) {
  const submit = useSubmit();
  return (
    <Table className="w-full">
      <TableHeader className="bg-primary">
        <TableRow>
          {headers.map((header, index) => (
            <TableHead key={index} className="text-center">
              <span className="text-primary-foreground">{header.title}</span>
            </TableHead>
          ))}
          <TableHead className="text-center">
            <span className="text-primary-foreground">Action</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {manipulationData.map((row, index) => (
          <TableRow key={index}>
            {headers.map((header) => (
              <TableCell key={header.title} className="text-center">
                {row[header.value]?.toString()}
              </TableCell>
            ))}
            <TableCell className="flex justify-center text-center">
              <TooltipProvider>
                <div className="flex items-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to={`/number-manipulations/${row.id}`}>
                        <Button variant="ghost" size="icon">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          submit(
                            {},
                            {
                              action: `/number-manipulations/${row.id}`,
                              method: "delete",
                            },
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
