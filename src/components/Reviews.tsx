"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current * 10) / 10);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function ReviewCard({ review, index }: { review: { name: string; text: string; rating: number }; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50 + index * 15, 0]);

  return (
    <motion.div
      ref={cardRef}
      style={{ scale, opacity, y }}
      className="bg-bordeaux-500/30 backdrop-blur-sm border border-or-400/10 p-8 md:p-10
                 hover:border-or-400/30 transition-all duration-500 group"
    >
      {/* Stars */}
      <div className="flex gap-1 mb-6">
        {Array.from({ length: review.rating }).map((_, j) => (
          <Star key={j} className="w-4 h-4 fill-or-400 text-or-400" />
        ))}
        {Array.from({ length: 5 - review.rating }).map((_, j) => (
          <Star key={j} className="w-4 h-4 text-or-400/30" />
        ))}
      </div>

      {/* Quote */}
      <p className="font-sans text-base text-cream-100/80 leading-relaxed mb-8 tracking-wide italic">
        &ldquo;{review.text}&rdquo;
      </p>

      {/* Name */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-or-400/20 flex items-center justify-center">
          <span className="font-serif text-sm text-or-300">{review.name.charAt(0)}</span>
        </div>
        <span className="font-sans text-sm text-cream-200/70 tracking-wide">{review.name}</span>
      </div>
    </motion.div>
  );
}

export default function Reviews() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const items = t("reviews.items", { returnObjects: true }) as Array<{
    name: string;
    text: string;
    rating: number;
  }>;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start center"],
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.5], [40, 0]);

  return (
    <section id="reviews" ref={sectionRef} className="section-padding bg-bordeaux-600 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-or-400 blur-[120px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-or-300 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          style={{ opacity: headerOpacity, y: headerY }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-or-400/60" />
            <Quote className="w-4 h-4 text-or-400" />
            <div className="w-12 h-px bg-or-400/60" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-cream-50 mb-4">
            {t("reviews.title")}
          </h2>
          <p className="font-sans text-base md:text-lg font-light text-cream-200/60 tracking-wide">
            {t("reviews.subtitle")}
          </p>
        </motion.div>

        {/* Google Rating Counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 mb-16 py-8 border-y border-or-400/15"
        >
          <div className="flex items-center gap-3">
            <span className="font-serif text-5xl text-or-400 font-bold">
              <AnimatedCounter target={4.8} />
            </span>
            <div className="flex flex-col">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={`w-4 h-4 ${i <= 4 ? "fill-or-400 text-or-400" : "fill-or-400/50 text-or-400/50"}`} />
                ))}
              </div>
              <span className="font-sans text-xs text-cream-200/50 tracking-wide">Google Reviews</span>
            </div>
          </div>
          <div className="w-px h-10 bg-or-400/20 hidden sm:block" />
          <div className="text-center">
            <span className="font-serif text-4xl text-cream-50 font-bold">
              <AnimatedCounter target={250} suffix="+" />
            </span>
            <p className="font-sans text-xs text-cream-200/50 tracking-wide mt-1">{t("reviews.verified")}</p>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((review, i) => (
            <ReviewCard key={i} review={review} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
