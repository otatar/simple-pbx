import { data, isRouteErrorResponse, Outlet, useLocation, type HeadersArgs } from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import { NavUser } from "~/components/nav-user";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { combineHeaders, getToast } from "~/utils/toast.server";
import type { Route } from "./+types/layout";
import { Toaster } from "~/components/toaster";
import db from "~/utils/db.server";
import { authClient } from "~/utils/auth.client";
import { authMiddleware } from "middleware/auth";
import { auth } from "~/utils/auth.server";

const SUB_BRAND = "Let it simply ring! ";

export function headers({ actionHeaders, loaderHeaders }: HeadersArgs) {
  return actionHeaders ? actionHeaders : loaderHeaders;
}

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ request }: Route.LoaderArgs) {
  const subBrand = (await db.globalSettings.findFirst({ select: { subBranding: true } }))
    ?.subBranding;
  //Get toast from session
  const { toast, headers: toastHeaders } = await getToast(request);
  const session = await auth.api.getSession({ headers: request.headers });
  return data({ toast, subBrand, user: session?.user }, { headers: combineHeaders(toastHeaders) });
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { toast } = loaderData;
  const { subBrand } = loaderData;
  const { user } = loaderData;
  const location = useLocation();
  const locationItems = location.pathname.split("/").slice(1);

  return (
    <div className="max-w-360 mx-auto">
      <SidebarProvider>
        <AppSidebar
          className="relative"
          subbrand={subBrand && subBrand.length > 0 ? subBrand : SUB_BRAND}
        />
        <SidebarInset>
          <header className="flex w-full h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex w-full items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb className="grow">
                <BreadcrumbList>
                  {locationItems.map((item, index) => (
                    <BreadcrumbItem key={item}>
                      {index == locationItems.length - 1 ? (
                        <BreadcrumbPage>
                          {item.charAt(0).toUpperCase() + item.slice(1)}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          href={"/" + locationItems.slice(0, index + 1).join("/")}
                          key={item}
                        >
                          {item.charAt(0).toUpperCase() + item.slice(1)}
                        </BreadcrumbLink>
                      )}
                      {index < locationItems.length - 1 ? <BreadcrumbSeparator /> : null}
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
              <NavUser user={user} />
            </div>
          </header>
          <Separator orientation="horizontal" />
          <div className="h-full flex-col m-2">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster toast={toast} />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
