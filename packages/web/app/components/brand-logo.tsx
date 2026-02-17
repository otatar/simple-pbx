import { Link } from "react-router";
import logo from "~/assets/images/sp.svg";

export default function BrandLogo({ sub }: { sub: string }) {
  return (
    <Link to="/" className="flex gap-2">
      <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
        <img className="w-8 h-8" src={logo} />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">SimplePBX</span>
        <span className="truncate text-xs">{sub}</span>
      </div>
    </Link>
  );
}
