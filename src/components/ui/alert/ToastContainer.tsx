"use client";
import React from "react";
import { useToast } from "@/context/ToastContext";
import Alert from "./Alert";

const ToastContainer: React.FC = () => {
    const { toasts } = useToast();

    return (
        <div className="fixed z-[9999] bottom-6 right-6 flex flex-col items-end gap-4 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className="animate-toast-in pointer-events-auto"
                    onAnimationEnd={() => {
                        /* Optionally handle animation end */
                    }}
                >
                    <Alert
                        variant={toast.variant}
                        title={toast.title}
                        message={toast.message}
                    />
                </div>
            ))}
            <style jsx global>{`
        @keyframes toast-in {
          0% { opacity: 0; transform: translateX(120%); }
          60% { opacity: 1; transform: translateX(-10px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-toast-in {
          animation: toast-in 0.5s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
        </div>
    );
};

export default ToastContainer;
