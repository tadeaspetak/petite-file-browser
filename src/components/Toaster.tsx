import { useTimeout } from "../hooks";
import { Toast, ToastType, useToasts } from "../providers/Toasts";

const colors: { [key in ToastType]: [string, string] } = {
  info: ["bg-blue-500", "border-blue-700"],
  success: ["bg-green-600", "border-green-800"],
  error: ["bg-red-600", "border-red-800"],
};

const ToastMessage: React.FC<{ toast: Toast }> = ({ toast }) => {
  const { untoast } = useToasts();
  const { id, body, type } = toast;

  useTimeout(() => untoast(id), toast.hideIn === 0 ? undefined : toast.hideIn);

  return (
    <div
      title="Close the notification"
      className={`rounded relative py-2 px-3 text-sm border-l-4 ${colors[type][1]} hover:shadow-inner text-white cursor-pointer ${colors[type][0]}`}
      onClick={() => untoast(id)}
    >
      <span className="inline-block mr-6 align-middle">{body}</span>
    </div>
  );
};

export const Toaster: React.FC = () => {
  const { toasts } = useToasts();
  return toasts.length === 0 ? null : (
    <div
      className="fixed z-50 flex justify-end top-8 left-1/2"
      style={{ transform: "translateX(-50%)" }}
    >
      <div className="flex flex-col items-end max-w-xs space-y-2">
        {toasts.map((toast) => (
          <ToastMessage key={toast.id} toast={toast} />
        ))}
      </div>
    </div>
  );
};
