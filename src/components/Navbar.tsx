"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#specialties", label: t("nav.specialties") },
    { href: "#menu", label: t("nav.menu") },
    { href: "#reviews", label: t("nav.reviews") },
    { href: "#contact", label: t("nav.contact") },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-cream-50/95 backdrop-blur-md shadow-lg shadow-bordeaux-900/5 py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex flex-col">
          <span className="font-serif text-xl md:text-2xl font-bold text-bordeaux-600 tracking-wide">
            Nom de l&apos;établissement
          </span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-or-500 font-sans font-medium">
            {t("hero.subtitle")}
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-sans text-sm tracking-[0.1em] uppercase text-bordeaux-700 hover:text-or-500
                         transition-colors duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 ltr:left-0 rtl:right-0 w-0 h-px bg-or-400 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <LanguageSwitcher />
          <a
            href="tel:+33100000000"
            className="flex items-center gap-2 text-sm text-bordeaux-600 hover:text-or-500 transition-colors duration-300"
          >
            <Phone className="w-4 h-4" />
          </a>
          <a href="#order" className="btn-primary text-xs">
            {t("nav.order")}
          </a>
        </div>

        {/* Mobile Toggle */}
        <div className="flex lg:hidden items-center gap-3">
          <LanguageSwitcher />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-bordeaux-600 p-2"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-cream-50/98 backdrop-blur-md border-t border-or-200/40 overflow-hidden"
          >
            <div className="flex flex-col py-6 px-6 gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-sans text-sm tracking-[0.1em] uppercase text-bordeaux-700 py-3
                             border-b border-cream-300/40 hover:text-or-500 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-3 pt-4">
                <a href="#order" className="btn-primary text-xs flex-1 text-center">
                  {t("nav.order")}
                </a>
                <a href="#reservation" className="btn-outline text-xs flex-1 text-center">
                  {t("nav.reserve")}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
