import type { PropsWithChildren } from "react";
import { Outlet } from "react-router";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";

type PageModalProps = {
  title: string;
};

export default function ModalRouteLayout(
  props: PropsWithChildren<PageModalProps>,
) {
  //overflow-y-scroll max-h-screen
  return (
    <Dialog open={true}>
      <DialogContent
        className="min-w-1/3 [&>button:last-child]:hidden"
        aria-describedby={undefined}
      >
        <DialogTitle>{props.title}</DialogTitle>
        <Outlet />
      </DialogContent>
    </Dialog>
  );
}
