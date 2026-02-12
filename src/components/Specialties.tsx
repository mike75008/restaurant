"use client";

import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star, ShoppingBag } from "lucide-react";

const placeholderImages = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
  "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80",
  "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=600&q=80",
  "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80",
  "https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=600&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
];

function SpecialtyCard({
  item,
  image,
  index,
  ingredientList,
  orderLabel,
}: {
  item: { name: string; description: string; price: string };
  image: string;
  index: number;
  ingredientList: string[];
  orderLabel: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.92, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [40, 0]);

  return (
    <motion.div
      ref={cardRef}
      style={{ scale, y }}
      className="group [perspective:1200px]"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative [transform-style:preserve-3d]"
      >
        {/* === FACE AVANT === */}
        <div className="[backface-visibility:hidden]">
          <div className="card-luxury overflow-hidden">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={image}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bordeaux-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="absolute top-4 right-4 bg-bordeaux-600/90 backdrop-blur-sm text-cream-50 px-4 py-1.5 font-sans text-sm font-medium tracking-wide"
              >
                {item.price}€
              </motion.div>
            </div>
            <div className="p-6 md:p-8">
              <h3 className="font-serif text-xl md:text-2xl text-bordeaux-600 mb-3">
                {item.name}
              </h3>
              <p className="font-sans text-sm text-bordeaux-700/60 leading-relaxed tracking-wide">
                {item.description}
              </p>
            </div>
          </div>
        </div>

        {/* === FACE ARRIÈRE === */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="h-full bg-gradient-to-br from-bordeaux-600 to-bordeaux-700 border border-or-400/20 p-8 flex flex-col justify-between
                          shadow-[0_0_30px_rgba(201,169,110,0.15)]">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-2xl text-cream-50">{item.name}</h3>
                <span className="font-serif text-xl text-or-400 font-medium">{item.price}€</span>
              </div>
              <div className="w-12 h-px bg-or-400/50 mb-6" />
              <ul className="space-y-2.5">
                {ingredientList.map((ing, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-or-400/70 flex-shrink-0" />
                    <span className="font-sans text-sm text-cream-100/80 tracking-wide">{ing}</span>
                  </li>
                ))}
              </ul>
            </div>
            <a
              href="#reservation"
              className="mt-6 flex items-center justify-center gap-2 py-3 bg-or-400 text-bordeaux-800
                         font-sans text-xs tracking-[0.15em] uppercase font-medium
                         hover:bg-or-300 transition-colors duration-300"
            >
              <ShoppingBag className="w-4 h-4" />
              {orderLabel}
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Specialties() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const items = t("specialties.items", { returnObjects: true }) as Array<{
    name: string;
    description: string;
    price: string;
  }>;
  const ingredientsAll = t("specialties.ingredients", { returnObjects: true }) as string[][];
  const orderBtn = t("specialties.order_btn");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start center"],
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.5], [40, 0]);

  return (
    <section id="specialties" ref={sectionRef} className="section-padding bg-cream-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          style={{ opacity: headerOpacity, y: headerY }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-or-400" />
            <Star className="w-4 h-4 text-or-400" />
            <div className="w-12 h-px bg-or-400" />
          </div>
          <h2 className="heading-luxury mb-4">{t("specialties.title")}</h2>
          <p className="text-elegant">{t("specialties.subtitle")}</p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {items.map((item, i) => (
            <SpecialtyCard
              key={i}
              item={item}
              image={placeholderImages[i]}
              index={i}
              ingredientList={ingredientsAll[i] || []}
              orderLabel={orderBtn}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
