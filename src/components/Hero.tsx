"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax: image zooms in and moves up as you scroll
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.6]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.5, 0.9]);
  // Content fades and moves up as you scroll away
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, -80]);

  return (
    <section ref={sectionRef} className="relative h-[110vh] flex items-center justify-center overflow-hidden">
      {/* Background with parallax zoom */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80')`,
          scale: imageScale,
          y: imageY,
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-bordeaux-900/70 via-bordeaux-800/50 to-bordeaux-900/80" />
      {/* Extra darkening on scroll */}
      <motion.div
        className="absolute inset-0 bg-bordeaux-900"
        style={{ opacity: useTransform(scrollYProgress, [0, 1], [0, 0.4]) }}
      />
      {/* Gold grain texture */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,_rgba(201,169,110,0.3)_0%,_transparent_70%)]" />

      {/* Content with scroll fade */}
      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto px-6"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Decorative line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 80 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="h-px bg-or-400 mx-auto mb-8"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-sans text-xs md:text-sm tracking-[0.4em] uppercase text-or-300 mb-6"
        >
          {t("hero.subtitle")}
        </motion.p>

        {/* Title - letter by letter animation */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-cream-50 mb-8 leading-[0.95]"
        >
          {t("hero.title").split("").map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.8 + i * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block"
              style={{ marginRight: letter === " " ? "0.25em" : "0" }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="font-sans text-base md:text-lg font-light text-cream-200/80 max-w-2xl mx-auto mb-12 leading-relaxed tracking-wide"
        >
          {t("hero.description")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#menu"
            className="inline-flex items-center justify-center px-10 py-4 border border-or-400/60 text-or-300
                       font-sans text-xs tracking-[0.2em] uppercase transition-all duration-500
                       hover:bg-or-400 hover:text-bordeaux-800 hover:border-or-400"
          >
            {t("hero.cta_menu")}
          </a>
          <a
            href="#order"
            className="inline-flex items-center justify-center px-10 py-4 bg-or-400 text-bordeaux-800
                       font-sans text-xs tracking-[0.2em] uppercase font-medium transition-all duration-500
                       hover:bg-or-300 hover:shadow-lg hover:shadow-or-400/30"
          >
            {t("hero.cta_order")}
          </a>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 80 }}
          transition={{ duration: 1.2, delay: 2.0, ease: [0.22, 1, 0.36, 1] }}
          className="h-px bg-or-400 mx-auto mt-12"
        />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        style={{ opacity: contentOpacity }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-or-400/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
