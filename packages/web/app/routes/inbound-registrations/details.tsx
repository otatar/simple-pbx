import type { Route } from "./+types/details";
import SimpleObjectDisplay from "~/components/simple-object-disp";
import { Button } from "~/components/ui/button";
import { useNavigate } from "react-router";
import { getContact } from "~/models/contacts.server";

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params;
  return getContact(id);
}

export default function ContactDetails({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  return (
    <>
      <SimpleObjectDisplay obj={loaderData!} />
      <Button onClick={() => navigate(-1)}>Cancel</Button>
    </>
  );
}
