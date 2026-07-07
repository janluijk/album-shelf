"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type ToastVariant = "info" | "success" | "error";

type ToastInput = {
  message: string;
  title?: string;
  variant?: ToastVariant;
};

type Toast = ToastInput & {
  id: number;
  leaving: boolean;
};

const visibleMs = 6000;
const exitMs = 300;

const ToastContext = createContext<(toast: ToastInput) => void>(() => {});

export function useNotify() {
  return useContext(ToastContext);
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const isVisible = entered && !toast.leaving;
  const accentBorder =
    toast.variant === "error"
      ? "border-[var(--accent)]"
      : "border-[var(--card-border)]";
  const titleColor =
    toast.variant === "success"
      ? "text-[var(--accent)]"
      : "text-[var(--foreground)]";

  return (
    <div
      className={`w-72 rounded-xl border ${accentBorder} bg-[var(--card)] p-4 text-xs text-[var(--muted)] shadow-lg transition-all duration-300 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          {toast.title && (
            <p className={`mb-1 font-medium ${titleColor}`}>{toast.title}</p>
          )}
          <p>{toast.message}</p>
        </div>
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={onDismiss}
          className="cursor-pointer leading-none text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((current) =>
      current.map((toast) =>
        toast.id === id ? { ...toast, leaving: true } : toast,
      ),
    );
    timers.current.push(
      setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, exitMs),
    );
  }, []);

  const notify = useCallback(
    (input: ToastInput) => {
      const id = nextId.current++;
      setToasts((current) => [...current, { ...input, id, leaving: false }]);
      timers.current.push(setTimeout(() => dismiss(id), visibleMs));
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2"
      >
        {toasts.map((toast) => (
          <ToastCard
            key={toast.id}
            toast={toast}
            onDismiss={() => dismiss(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
