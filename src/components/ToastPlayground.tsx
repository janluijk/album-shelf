"use client";

import { useNotify } from "@/components/ToastProvider";

const buttonClass =
  "cursor-pointer rounded-lg border border-[var(--card-border)] px-4 py-2 text-sm text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]";

export default function ToastPlayground() {
  const notify = useNotify();

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => notify({ message: "Just letting you know." })}
        className={buttonClass}
      >
        Info
      </button>
      <button
        type="button"
        onClick={() =>
          notify({
            title: "Saved",
            message: "Your changes were stored successfully.",
            variant: "success",
          })
        }
        className={buttonClass}
      >
        Success
      </button>
      <button
        type="button"
        onClick={() =>
          notify({
            title: "Could not save",
            message: "Something went wrong. Please try again.",
            variant: "error",
          })
        }
        className={buttonClass}
      >
        Error
      </button>
      <button
        type="button"
        onClick={() =>
          notify({
            title: "A longer notification",
            message:
              "Toasts wrap longer copy across multiple lines while keeping the fixed width, auto-dismiss after six seconds, and can always be dismissed manually with the ✕ button.",
          })
        }
        className={buttonClass}
      >
        Long message
      </button>
      <button
        type="button"
        onClick={() => {
          notify({ message: "First of three." });
          notify({
            title: "Saved",
            message: "Second of three.",
            variant: "success",
          });
          notify({
            title: "Could not save",
            message: "Third of three.",
            variant: "error",
          });
        }}
        className={buttonClass}
      >
        Stack ×3
      </button>
    </div>
  );
}
