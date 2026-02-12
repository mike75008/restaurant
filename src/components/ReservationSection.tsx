"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { CalendarDays, User, Phone, Clock, Users, Check } from "lucide-react";

export default function ReservationSection() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="reservation" className="section-padding bg-cream-50">
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
            <CalendarDays className="w-4 h-4 text-or-400" />
            <div className="w-12 h-px bg-or-400" />
          </div>
          <h2 className="heading-luxury mb-4">{t("reservation.title")}</h2>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-or-400" />
              <input
                type="text"
                placeholder={t("reservation.name")}
                required
                className="w-full pl-12 pr-4 py-4 bg-white border border-or-200/50 font-sans text-sm
                         text-bordeaux-700 placeholder:text-bordeaux-400/40 tracking-wide
                         focus:outline-none focus:border-or-400 transition-colors duration-300"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-or-400" />
              <input
                type="tel"
                placeholder={t("reservation.phone")}
                required
                className="w-full pl-12 pr-4 py-4 bg-white border border-or-200/50 font-sans text-sm
                         text-bordeaux-700 placeholder:text-bordeaux-400/40 tracking-wide
                         focus:outline-none focus:border-or-400 transition-colors duration-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-or-400" />
              <input
                type="date"
                required
                className="w-full pl-12 pr-4 py-4 bg-white border border-or-200/50 font-sans text-sm
                         text-bordeaux-700 tracking-wide
                         focus:outline-none focus:border-or-400 transition-colors duration-300"
              />
            </div>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-or-400" />
              <input
                type="time"
                required
                className="w-full pl-12 pr-4 py-4 bg-white border border-or-200/50 font-sans text-sm
                         text-bordeaux-700 tracking-wide
                         focus:outline-none focus:border-or-400 transition-colors duration-300"
              />
            </div>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-or-400" />
              <select
                required
                className="w-full pl-12 pr-4 py-4 bg-white border border-or-200/50 font-sans text-sm
                         text-bordeaux-700 tracking-wide appearance-none
                         focus:outline-none focus:border-or-400 transition-colors duration-300"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "personne" : "personnes"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 font-sans text-sm tracking-[0.2em] uppercase font-medium transition-all duration-500
              ${submitted
                ? "bg-green-600 text-white"
                : "bg-or-400 text-bordeaux-800 hover:bg-or-300 hover:shadow-lg hover:shadow-or-400/20"
              }`}
          >
            <span className="flex items-center justify-center gap-2">
              {submitted ? (
                <>
                  <Check className="w-4 h-4" />
                  Confirmé !
                </>
              ) : (
                t("reservation.submit")
              )}
            </span>
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
