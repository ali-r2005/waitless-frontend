import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2Icon } from "lucide-react"

interface AlertDialogDestructiveProps {
  children: React.ReactNode;
  title: string;
  description: string;
  onAction: () => void;
  buttonText?:{
    cancel?: string;
    action?: string;
  } ;
}

export function AlertDialogDestructive({
  children, 
  title, 
  description, 
  onAction,
  buttonText = {cancel: "Cancel", action: "Delete"}
}: AlertDialogDestructiveProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            variant="outline" 
            onClick={(e) => e.stopPropagation()}
          >
            {buttonText.cancel}
          </AlertDialogCancel>
          <AlertDialogAction 
            variant="destructive" 
            onClick={(e) => {
              e.stopPropagation();
              onAction();
            }}
          >
            {buttonText.action}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

