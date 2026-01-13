import type { MiddlewareFunction } from "react-router";
import { userContext } from "~/context";
import { auth } from "~/utils/auth.server";
import { redirectWithToast } from "~/utils/toast.server";

export const authMiddleware: MiddlewareFunction<Response> = async ({ request, context }) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session || !session.user) {
    return redirectWithToast("/login", {
      title: "Unauthenticated",
      description: "You must be logged in to access this page.",
      type: "warning",
    });
  }

  context.set(userContext, session.user);
};
