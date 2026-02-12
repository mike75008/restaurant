"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ShoppingBag, MapPin, User, Phone, MessageSquare, Check } from "lucide-react";

export default function OrderSection() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"pickup" | "delivery">("delivery");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="order" className="section-padding bg-white/40">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-or-400" />
            <ShoppingBag className="w-4 h-4 text-or-400" />
            <div className="w-12 h-px bg-or-400" />
          </div>
          <h2 className="heading-luxury mb-4">{t("order.title")}</h2>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Mode toggle */}
          <div className="flex border border-or-300/50 overflow-hidden">
            <button
              type="button"
              onClick={() => setMode("pickup")}
              className={`flex-1 py-3.5 font-sans text-sm tracking-[0.1em] uppercase transition-all duration-300
                ${mode === "pickup"
                  ? "bg-bordeaux-600 text-cream-50"
                  : "bg-transparent text-bordeaux-600 hover:bg-cream-100"
                }`}
            >
              {t("order.pickup")}
            </button>
            <button
              type="button"
              onClick={() => setMode("delivery")}
              className={`flex-1 py-3.5 font-sans text-sm tracking-[0.1em] uppercase transition-all duration-300
                ${mode === "delivery"
                  ? "bg-bordeaux-600 text-cream-50"
                  : "bg-transparent text-bordeaux-600 hover:bg-cream-100"
                }`}
            >
              {t("order.delivery")}
            </button>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-or-400" />
              <input
                type="text"
                placeholder={t("order.name")}
                required
                className="w-full pl-12 pr-4 py-4 bg-cream-50 border border-or-200/50 font-sans text-sm
                         text-bordeaux-700 placeholder:text-bordeaux-400/40 tracking-wide
                         focus:outline-none focus:border-or-400 transition-colors duration-300"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-or-400" />
              <input
                type="tel"
                placeholder={t("order.phone")}
                required
                className="w-full pl-12 pr-4 py-4 bg-cream-50 border border-or-200/50 font-sans text-sm
                         text-bordeaux-700 placeholder:text-bordeaux-400/40 tracking-wide
                         focus:outline-none focus:border-or-400 transition-colors duration-300"
              />
            </div>
          </div>

          {mode === "delivery" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="relative"
            >
              <MapPin className="absolute left-4 top-4 w-4 h-4 text-or-400" />
              <input
                type="text"
                placeholder={t("order.address")}
                required
                className="w-full pl-12 pr-4 py-4 bg-cream-50 border border-or-200/50 font-sans text-sm
                         text-bordeaux-700 placeholder:text-bordeaux-400/40 tracking-wide
                         focus:outline-none focus:border-or-400 transition-colors duration-300"
              />
            </motion.div>
          )}

          <div className="relative">
            <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-or-400" />
            <textarea
              placeholder={t("order.notes")}
              rows={4}
              className="w-full pl-12 pr-4 py-4 bg-cream-50 border border-or-200/50 font-sans text-sm
                       text-bordeaux-700 placeholder:text-bordeaux-400/40 tracking-wide resize-none
                       focus:outline-none focus:border-or-400 transition-colors duration-300"
            />
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 font-sans text-sm tracking-[0.2em] uppercase font-medium transition-all duration-500
              ${submitted
                ? "bg-green-600 text-white"
                : "bg-bordeaux-600 text-cream-50 hover:bg-bordeaux-700 hover:shadow-lg hover:shadow-bordeaux-600/20"
              }`}
          >
            <span className="flex items-center justify-center gap-2">
              {submitted ? (
                <>
                  <Check className="w-4 h-4" />
                  Envoyé !
                </>
              ) : (
                t("order.submit")
              )}
            </span>
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
