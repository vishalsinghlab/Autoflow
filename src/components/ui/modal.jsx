import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Modal = ({
  open,
  onClose,
  title = "",
  description = "",
  children,
  className = "w-[auto]",
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={`bg-transparent p-0 m-0 border-none shadow-none w-auto ${className}`}
      >
        <DialogHeader className="p-0 m-0">
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="mt-0">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export { Modal };
