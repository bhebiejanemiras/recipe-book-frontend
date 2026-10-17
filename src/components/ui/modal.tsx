import { useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export function Modal({ open, onClose, title, children }: ModalProps) {
  // Close on Escape and stop the page behind the dialog from scrolling.
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-stretch justify-center bg-ink/60 lg:items-center lg:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title ?? "Dialog"}
        className="flex h-full w-full flex-col bg-white text-ink lg:h-auto lg:max-h-[90vh] lg:max-w-2xl lg:border lg:border-ink/15"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-ink/10 px-6 py-4">
          <h2 className="font-serif text-lg tracking-tight">{title}</h2>
          <Button variant="tertiary" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
