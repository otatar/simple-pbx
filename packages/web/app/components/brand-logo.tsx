import { Phone } from "lucide-react";
import { Link } from "react-router";

export default function BrandLogo({ sub }: { sub: string }) {
  return (
    <Link to="/" className="flex gap-2">
      <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
        <Phone className="size-4" />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">SimplePBX</span>
        <span className="truncate text-xs">{sub}</span>
      </div>
    </Link>
  );
}
