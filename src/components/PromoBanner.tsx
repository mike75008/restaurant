"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChefHat } from "lucide-react";

export default function PromoBanner() {
  const [visible, setVisible] = useState(true);
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-bordeaux-600 text-cream-50 overflow-hidden z-[60] relative"
        >
          <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-center gap-3">
            <ChefHat className="w-4 h-4 text-or-400 flex-shrink-0" />
            <p className="font-sans text-xs md:text-sm tracking-wide text-center">
              <span className="text-or-400 font-medium">{t("promo.text_highlight")}</span>{" "}
              {t("promo.text")}
              <span className="hidden md:inline"> — </span>
              <span className="hidden md:inline text-cream-200/70">{t("promo.text_detail")}</span>
            </p>
            <button
              onClick={() => setVisible(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-cream-200/50 hover:text-cream-50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
