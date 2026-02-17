import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useToast from "../hooks/useToast";
import "./Styles/OfflineBanner.css";

/**
 * Banner fijo que informa al usuario cuando no hay conexión.
 * Se oculta automáticamente al recuperar la conexión y muestra toast.
 */
export default function OfflineBanner({ isOnline }) {
  const { addToast } = useToast();
  const wasOffline = React.useRef(false);

  useEffect(() => {
    if (isOnline && wasOffline.current) {
      addToast("Conexión restaurada", { type: "success" });
      wasOffline.current = false;
    } else if (!isOnline) {
      wasOffline.current = true;
    }
  }, [isOnline, addToast]);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          className="offline-banner"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="alert"
          aria-live="assertive"
        >
          <span className="material-symbols-rounded offline-banner__icon">
            wifi_off
          </span>
          <span className="offline-banner__text">
            Sin conexión. Algunas funciones pueden no estar disponibles.
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
