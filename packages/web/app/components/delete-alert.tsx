import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

type DeleteAlertProps = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActionClick?: () => void;
};

export default function DeleteAlert({ id, open, onOpenChange, onActionClick }: DeleteAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete confirmation?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete entry with id: {id} in the
            database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-background text-foreground">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onActionClick}
            className="bg-destructive hover:bg-destructive/90"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
