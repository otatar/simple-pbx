import { type LucideIcon } from "lucide-react";
import { createElement } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { iconColorMap, type IconColor } from "~/types/icon-color";

export default function StatusBox({
  title,
  count,
  linkUrl,
  icon,
  iconColor = "gray-300",
}: {
  title: string;
  count: number;
  linkUrl: string;
  icon: LucideIcon;
  iconColor?: string;
}) {
  return (
    <Card className="py-4">
      <CardHeader></CardHeader>
      <CardContent>
        <div className="flex gap-4 justify-center items-center">
          {createElement(icon, {
            className: cn("h-10 w-10", iconColorMap[iconColor as IconColor]),
          })}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">{title}</p>
            <p className="text-2xl font-semibold">{count}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Separator />
        <Link to={linkUrl} className="text-sm font-medium text-app-blue hover:underline">
          View All
        </Link>
      </CardFooter>
    </Card>
  );
}
