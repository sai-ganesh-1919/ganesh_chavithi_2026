import React, { useEffect } from "react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl border border-orange-900/50 fade-in"
        style={{ background: "#1A0400", maxHeight: "90vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-orange-900/40">
          <h3 className="font-cinzel text-lg font-semibold gold-text">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-orange-300 hover:bg-orange-900/40 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-5 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

export function Field({ label, children }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-orange-300 mb-1">{label}</label>
      {children}
    </div>
  );
}

interface ActionBtnProps {
  onClick: () => void;
  variant?: "primary" | "danger" | "ghost";
  children: React.ReactNode;
  type?: "button" | "submit";
  className?: string;
}

export function ActionBtn({ onClick, variant = "primary", children, type = "button", className = "" }: ActionBtnProps) {
  const base = "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ";
  const styles = {
    primary: "bg-gradient-to-r from-orange-600 to-yellow-500 text-black hover:brightness-110",
    danger: "bg-red-900/60 text-red-300 border border-red-700/50 hover:bg-red-800/60",
    ghost: "bg-orange-900/30 text-orange-300 border border-orange-700/30 hover:bg-orange-900/50",
  };
  return (
    <button type={type} onClick={onClick} className={base + styles[variant] + " " + className}>
      {children}
    </button>
  );
}