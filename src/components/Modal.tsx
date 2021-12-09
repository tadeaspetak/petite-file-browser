import { faTimes } from "@fortawesome/free-solid-svg-icons";
import React, { useCallback, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

import { classNames } from "../utils";
import { Button } from "./Button";

const Wrapper: React.FC<{
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  isOpen?: boolean;
  onClose: () => void;
}> = ({ children, closeOnClickOutside = true, closeOnEsc = true, isOpen = true, onClose }) => {
  const portal = useRef(document.createElement("div"));
  useEffect(() => {
    const current = portal.current;
    document.body.appendChild(portal.current);
    return () => void document.body.removeChild(current);
  }, []);

  // note: keep `useCallback`, used in the `useEffect` below
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (isOpen && closeOnEsc && e.key === "Escape" && onClose) onClose();
    },
    [closeOnEsc, isOpen, onClose],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => void window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  return ReactDOM.createPortal(
    <div
      className={classNames(
        "fixed top-0 bottom-0 left-0 right-0 z-40 p-4 overflow-y-auto text-white",
        `${isOpen ? "visible" : "invisible"}`,
      )}
    >
      <div
        className="fixed top-0 bottom-0 left-0 right-0 bg-gray-600 opacity-90"
        onClick={closeOnClickOutside ? onClose : undefined}
      />
      <div className="relative w-full max-w-sm mx-auto mt-8">
        <div className="overflow-hidden bg-gray-800 rounded shadow-xl">{children}</div>
        <span className="absolute top-2 right-2">
          <Button round icon={faTimes} size="sm" kind="gray" onClick={() => onClose()} />
        </span>
      </div>
    </div>,
    portal.current,
  );
};

const Title: React.FC = ({ children }) => (
  <div className="block p-4 bg-gray-900">
    <h1 className="text-lg">{children}</h1>
  </div>
);

const Body: React.FC = ({ children }) => <div className="p-4">{children}</div>;

export const Modal = {
  Wrapper,
  Title,
  Body,
};
