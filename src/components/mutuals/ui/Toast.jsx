import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { subscribeToast } from "../../../utils/ui";

export default function Toast() {
  const [msg, setMsg] = useState("");
  useEffect(() => subscribeToast(setMsg), []);
  return (
    <AnimatePresence>
      {msg && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-x-0 bottom-6 z-[100] mx-auto flex w-fit items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-black text-white shadow-2xl"
        >
          {msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
