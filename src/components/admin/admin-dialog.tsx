"use client";

import { useEffect, useId, useRef } from "react";

/**
 * Modal dialog built on the native <dialog> element (showModal):
 * the rest of the page becomes inert, focus stays inside, Escape closes it,
 * and it renders in the top layer so messages inside are never hidden
 * behind an overlay. Focus returns to the opener when it closes.
 */
export function AdminDialog({
  open,
  title,
  description,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  description?: React.ReactNode;
  onClose: () => void;
  children?: React.ReactNode;
  footer: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      const opener = document.activeElement as HTMLElement | null;
      dialog.showModal();
      return () => {
        if (dialog.open) dialog.close();
        opener?.focus?.();
      };
    }
    return undefined;
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onCancel={(e) => {
        // Escape: let React state drive closing.
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // Click on the backdrop (the dialog element itself) closes.
        if (e.target === ref.current) onClose();
      }}
      className="w-[calc(100%-2rem)] max-w-md rounded-2xl border border-line-subtle bg-surface p-0 text-content-primary shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-[2px]"
    >
      <div className="space-y-4 p-6">
        <h2 id={titleId} className="font-display text-lg font-bold">
          {title}
        </h2>
        {description ? (
          <div id={descId} className="text-sm text-content-secondary">
            {description}
          </div>
        ) : null}
        {children}
        <div className="flex flex-wrap justify-end gap-2 pt-2">{footer}</div>
      </div>
    </dialog>
  );
}
