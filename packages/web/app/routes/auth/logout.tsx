import { redirect } from "react-router";
import { auth } from "~/utils/auth.server";
import type { Route } from "./+types/logout";
import { redirectWithToast } from "~/utils/toast.server";

export const action = async ({ request }: Route.ActionArgs) => {
  await auth.api.signOut({ headers: request.headers });
  return redirectWithToast("/login", {
    title: "Logged out",
    description: "You have been logged out successfully.",
    type: "success",
  });
};

export const loader = async () => redirect("/");
