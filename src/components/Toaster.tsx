import { Toast, ToastType, useToasts } from "../providers/Toasts";
import { useTimeout } from "../utils";

const colors: { [key in ToastType]: { bg: string; border: string } } = {
  info: { bg: "bg-blue-400", border: "border-blue-700" },
  success: { bg: "bg-green-500", border: "border-green-700" },
  error: { bg: "bg-red-500", border: "border-red-700" },
};

const ToastMessage: React.FC<{ toast: Toast }> = ({ toast }) => {
  const { remove } = useToasts();
  const { id, body, type } = toast;

  useTimeout(() => remove(id), toast.hideIn === 0 ? undefined : toast.hideIn);

  return (
    <div
      title="Close the notification"
      className={`relative p-2 text-sm border-l-4 ${colors[type].border} hover:shadow-inner text-white cursor-pointer ${colors[type].bg}`}
      onClick={() => {
        remove(id);
      }}
    >
      <span className="inline-block mr-6 align-middle">{body}</span>
    </div>
  );
};

export const Toaster: React.FC = () => {
  const { toasts } = useToasts();
  return toasts.length === 0 ? null : (
    <div className="fixed top-8 right-2 z-10 flex justify-end">
      <div className="flex flex-col items-end max-w-xs space-y-2">
        {toasts.map((toast) => (
          <ToastMessage key={toast.id} toast={toast} />
        ))}
      </div>
    </div>
  );
};
