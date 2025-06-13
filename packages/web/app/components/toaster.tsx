import type { Toast } from "~/utils/toast.server";
import { useEffect } from "react";
import { Toaster as SonnerToaster, toast as showToast } from "sonner";
//import { useTheme } from "remix-themes";

export function Toaster({ toast }: { toast?: Toast | null }) {
  //const [theme] = useTheme();
  return (
    <>
      <SonnerToaster
        className="toaster group"
        closeButton
        position="top-center"
        richColors
        style={
          {
            "--normal-bg": "var(--popover)",
            "--normal-text": "var(--popover-foreground)",
            "--normal-border": "var(--border)",
          } as React.CSSProperties
        }
      />
      {toast ? <ShowToast toast={toast} /> : null}
    </>
  );
}

function ShowToast({ toast }: { toast: Toast }) {
  const { id, type, title, description } = toast;
  useEffect(() => {
    setTimeout(() => {
      showToast[type](title, { id, description });
    }, 0);
  }, [description, id, title, type]);
  return null;
}

export { toast as showToast } from "sonner";
