"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Truck } from "lucide-react";

export default function Contact() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start center"],
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.5], [40, 0]);

  return (
    <section id="contact" ref={sectionRef} className="section-padding bg-cream-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          style={{ opacity: headerOpacity, y: headerY }}
          className="text-center mb-20"
        >
          <div className="gold-line-short mb-6" />
          <h2 className="heading-luxury mb-4">{t("contact.title")}</h2>
          <p className="text-elegant">{t("contact.subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            {/* Address */}
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-or-300/50">
                <MapPin className="w-5 h-5 text-or-500" />
              </div>
              <div>
                <h4 className="font-serif text-lg text-bordeaux-600 mb-1">Adresse</h4>
                <p className="text-elegant text-sm">{t("contact.address")}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-or-300/50">
                <Phone className="w-5 h-5 text-or-500" />
              </div>
              <div>
                <h4 className="font-serif text-lg text-bordeaux-600 mb-1">{t("contact.order_phone")}</h4>
                <a
                  href="tel:+33100000000"
                  className="font-sans text-xl text-or-500 font-medium hover:text-or-600 transition-colors"
                >
                  {t("contact.phone")}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-or-300/50">
                <Mail className="w-5 h-5 text-or-500" />
              </div>
              <div>
                <h4 className="font-serif text-lg text-bordeaux-600 mb-1">Email</h4>
                <p className="text-elegant text-sm">{t("contact.email")}</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-or-300/50">
                <Clock className="w-5 h-5 text-or-500" />
              </div>
              <div>
                <h4 className="font-serif text-lg text-bordeaux-600 mb-3">{t("contact.hours_title")}</h4>
                <div className="space-y-1.5">
                  <p className="font-sans text-sm text-bordeaux-700/70 tracking-wide">
                    {t("contact.hours.lun_ven")}
                  </p>
                  <p className="font-sans text-sm text-bordeaux-700/70 tracking-wide">
                    {t("contact.hours.sam")}
                  </p>
                  <p className="font-sans text-sm text-bordeaux-700/70 tracking-wide">
                    {t("contact.hours.dim")}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-or-300/50">
                <Truck className="w-5 h-5 text-or-500" />
              </div>
              <div>
                <h4 className="font-serif text-lg text-bordeaux-600 mb-1">Livraison</h4>
                <p className="text-elegant text-sm">{t("contact.delivery")}</p>
              </div>
            </div>
          </motion.div>

          {/* Map placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-square lg:aspect-auto lg:h-full min-h-[400px] bg-cream-200/50 border border-or-200/50 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2623.0!2d2.3599!3d48.8950!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s142+rue+la+chapelle+paris!5e0!3m2!1sfr!2sfr!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "saturate(0.6) contrast(1.1)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
