import { getCDRById } from "~/models/cdr.server";
import type { Route } from "./+types/details";
import SimpleObjectDisplay from "~/components/simple-object-disp";
import { Button } from "~/components/ui/button";
import { useNavigate } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params;
  return getCDRById(Number(id));
}

export default function CdrDetails({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  return (
    <>
      <SimpleObjectDisplay obj={loaderData!} />
      <Button onClick={() => navigate(-1)}>Cancel</Button>
    </>
  );
}
