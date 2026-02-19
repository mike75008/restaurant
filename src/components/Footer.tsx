"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Instagram, Facebook, ArrowUp } from "lucide-react";
import { useDemo } from "@/lib/DemoContext";

export default function Footer() {
  const { t } = useTranslation();
  const demo = useDemo();
  const brandName = demo?.name ?? "Nom de l'établissement";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-bordeaux-800 text-cream-200/60">
      {/* Gold separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-or-400/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl text-cream-50 mb-3">
              {brandName}
            </h3>
            <p className="font-sans text-sm tracking-wide leading-relaxed">
              {t("footer.tagline")}
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center border border-or-400/20
                         text-or-400/60 hover:text-or-400 hover:border-or-400/50 transition-all duration-300"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center border border-or-400/20
                         text-or-400/60 hover:text-or-400 hover:border-or-400/50 transition-all duration-300"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans text-xs tracking-[0.2em] uppercase text-or-400 mb-6">
              Navigation
            </h4>
            <div className="space-y-3">
              {[
                { href: "#specialties", label: t("nav.specialties") },
                { href: "#menu", label: t("nav.menu") },
                { href: "#order", label: t("nav.order") },
                { href: "#reservation", label: t("nav.reserve") },
                { href: "#contact", label: t("nav.contact") },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block font-sans text-sm tracking-wide hover:text-or-400 transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans text-xs tracking-[0.2em] uppercase text-or-400 mb-6">
              Contact
            </h4>
            <div className="space-y-3 font-sans text-sm tracking-wide">
              <p>{t("contact.address")}</p>
              <p>{t("contact.phone")}</p>
              <p>{t("contact.email")}</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-or-400/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs tracking-wide text-cream-200/40">
            © {new Date().getFullYear()} Nom de l&apos;établissement. {t("footer.rights")}.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="font-sans text-xs tracking-wide text-cream-200/40 hover:text-or-400 transition-colors">
              {t("footer.legal")}
            </a>
            <a href="#" className="font-sans text-xs tracking-wide text-cream-200/40 hover:text-or-400 transition-colors">
              {t("footer.privacy")}
            </a>
          </div>
        </div>
      </div>

      {/* Back to top */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 ltr:right-8 rtl:left-8 w-12 h-12 bg-bordeaux-600 text-cream-50 flex items-center justify-center
                 shadow-lg shadow-bordeaux-900/20 hover:bg-or-400 hover:text-bordeaux-800 transition-colors duration-300 z-40"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
}
