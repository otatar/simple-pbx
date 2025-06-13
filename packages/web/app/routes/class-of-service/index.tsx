import { getCos } from "~/models/class-of-service.server";
import type { Route } from "./+types";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Link, Outlet } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { BookOpen, PlusCircle } from "lucide-react";

export async function loader() {
  return await getCos();
}

export default function ClassOfServiceIndex({
  loaderData,
}: Route.ComponentProps) {
  return (
    <div className="flex gap-4">
      <Card className="p-2 w-1/3">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Class of Service</CardTitle>
          <Link to="/class-of-service/new">
            <Button size="sm">
              <PlusCircle className="h-4 w-4" />
              New
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of classes of service.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">ID</TableHead>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Class of Service</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loaderData.map((cos) => (
                <TableRow key={cos.id}>
                  <TableCell className="text-center">{cos.id}</TableCell>
                  <TableCell className="text-center">{cos.name}</TableCell>
                  <TableCell className="text-center">{cos.cos}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Link to={`/class-of-service/${cos.id}`}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <BookOpen className="h-4 w-4 text-blue-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>More</TooltipContent>
                        </Tooltip>
                      </Link>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="w-2/3">
        <Outlet />
      </div>
    </div>
  );
}
