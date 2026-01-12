import { ChevronRight, Orbit, type LucideIcon } from "lucide-react";
import { NavLink } from "react-router";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar";

interface SideBarItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

export function NavMain({
  pbxItems,
  adminItems,
}: {
  pbxItems: SideBarItem[];
  adminItems: SideBarItem[];
}) {
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>DASHBOARDS</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "bg-sidebar-accent rounded-md font-semibold" : ""
              }
            >
              <SidebarMenuSubItem>
                <SidebarMenuButton tooltip="Status">
                  <Orbit />
                  Status
                </SidebarMenuButton>
              </SidebarMenuSubItem>
            </NavLink>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>PBX</SidebarGroupLabel>
        <SidebarMenu>
          {pbxItems.map((item) => (
            <div key={item.title}>
              {item.items ? (
                <Collapsible asChild defaultOpen={item.isActive} className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <NavLink
                            prefetch="intent"
                            key={subItem.title}
                            to={subItem.url}
                            className={({ isActive }) =>
                              isActive ? "bg-sidebar-accent rounded-md font-semibold" : ""
                            }
                          >
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <span>{subItem.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </NavLink>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem>
                  <NavLink
                    to={item.url}
                    className={({ isActive }) =>
                      isActive ? "bg-sidebar-accent rounded-md font-semibold" : ""
                    }
                  >
                    <SidebarMenuSubItem>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}

                        {item.title}
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                  </NavLink>
                </SidebarMenuItem>
              )}
            </div>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>ADMIN</SidebarGroupLabel>
        <SidebarMenu>
          {adminItems.map((item) => (
            <div key={item.title}>
              {item.items ? (
                <Collapsible asChild defaultOpen={item.isActive} className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <NavLink
                            prefetch="intent"
                            key={subItem.title}
                            to={subItem.url}
                            className={({ isActive }) =>
                              isActive ? "bg-sidebar-accent rounded-md font-semibold" : ""
                            }
                          >
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <span>{subItem.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </NavLink>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem>
                  <NavLink
                    to={item.url}
                    className={({ isActive }) =>
                      isActive ? "bg-sidebar-accent rounded-md font-semibold" : ""
                    }
                  >
                    <SidebarMenuSubItem>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}

                        {item.title}
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                  </NavLink>
                </SidebarMenuItem>
              )}
            </div>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
