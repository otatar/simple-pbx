import * as React from "react";
import { Route, Settings2, Network, Sparkles, Signpost, ScrollText, Users } from "lucide-react";

import { NavMain } from "~/components/nav-main";
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "~/components/ui/sidebar";
import BrandLogo from "./brand-logo";

const data = {
  pbx: [
    {
      title: "Endpoints",
      url: "#",
      icon: Network,
      items: [
        {
          title: "Extensions",
          url: "/extensions",
        },
        {
          title: "Trunks",
          url: "/trunks",
        },
      ],
    },
    {
      title: "Class of Service",
      url: "/class-of-service",
      icon: Signpost,
    },
    {
      title: "Number Manipulation",
      url: "/number-manipulations",
      icon: Sparkles,
    },
    {
      title: "Call Routing",
      url: "#",
      icon: Route,
      items: [
        {
          title: "Outbound",
          url: "/outbound-routing",
        },
        {
          title: "Inbound",
          url: "/inbound-routing",
        },
      ],
    },
    {
      title: "Call Detail Records",
      url: "/cdr",
      icon: ScrollText,
    },
  ],
  navAdmin: [
    {
      title: "User Management",
      url: "/users",
      icon: Users,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({
  subbrand,
  ...props
}: React.ComponentProps<typeof Sidebar> & { subbrand: string }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <BrandLogo sub={subbrand} />
      </SidebarHeader>
      <SidebarContent className="mt-4">
        <NavMain pbxItems={data.pbx} adminItems={data.navAdmin} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
