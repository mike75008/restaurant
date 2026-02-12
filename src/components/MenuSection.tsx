"use client";

import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { UtensilsCrossed, Waves, Beef, IceCreamCone, GlassWater, ChefHat } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  entrees: <UtensilsCrossed className="w-5 h-5" />,
  plats: <ChefHat className="w-5 h-5" />,
  poissons: <Waves className="w-5 h-5" />,
  viandes: <Beef className="w-5 h-5" />,
  desserts: <IceCreamCone className="w-5 h-5" />,
  vins: <GlassWater className="w-5 h-5" />,
};

const menuImages: Record<string, string[]> = {
  entrees: [
    "https://images.unsplash.com/photo-1547592180-85f173990554?w=120&q=80",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=120&q=80",
    "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=120&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&q=80",
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=120&q=80",
    "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=120&q=80",
  ],
  plats: [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&q=80",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=120&q=80",
    "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=120&q=80",
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=120&q=80",
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120&q=80",
    "https://images.unsplash.com/photo-1558030006-450675393462?w=120&q=80",
  ],
  poissons: [
    "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=120&q=80",
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=120&q=80",
    "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=120&q=80",
    "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=120&q=80",
  ],
  viandes: [
    "https://images.unsplash.com/photo-1558030006-450675393462?w=120&q=80",
    "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=120&q=80",
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=120&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&q=80",
  ],
  desserts: [
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=120&q=80",
    "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=120&q=80",
    "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=120&q=80",
    "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=120&q=80",
  ],
  vins: [
    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=120&q=80",
    "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=120&q=80",
    "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=120&q=80",
    "https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?w=120&q=80",
    "https://images.unsplash.com/photo-1549319114-d67887c51aed?w=120&q=80",
  ],
};

export default function MenuSection() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("entrees");
  const sectionRef = useRef<HTMLElement>(null);

  const categories = t("menu.categories", { returnObjects: true }) as Record<string, string>;
  const allItems = t("menu.items", { returnObjects: true }) as Record<
    string,
    Array<{ name: string; desc: string; price: string }>
  >;

  const categoryKeys = Object.keys(categories);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start center"],
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.5], [40, 0]);
  const headerScale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  return (
    <section id="menu" ref={sectionRef} className="section-padding bg-cream-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          style={{ opacity: headerOpacity, y: headerY, scale: headerScale }}
          className="text-center mb-16"
        >
          <div className="gold-line-short mb-6" />
          <h2 className="heading-luxury mb-4">{t("menu.title")}</h2>
          <p className="text-elegant">{t("menu.subtitle")}</p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-2 md:gap-3 mb-16"
        >
          {categoryKeys.map((key) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex items-center gap-2 px-5 py-2.5 font-sans text-xs md:text-sm tracking-[0.1em] uppercase
                         transition-all duration-400 border
                         ${
                           activeCategory === key
                             ? "bg-bordeaux-600 text-cream-50 border-bordeaux-600 shadow-lg shadow-bordeaux-600/20"
                             : "bg-transparent text-bordeaux-600 border-or-300/50 hover:border-or-400 hover:text-or-600"
                         }`}
            >
              {categoryIcons[key]}
              {categories[key]}
            </button>
          ))}
        </motion.div>

        {/* Menu Items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-1"
          >
            {allItems[activeCategory]?.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -30, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="group flex items-center gap-4 py-4 px-4 md:px-6 border-b border-cream-300/40
                           hover:bg-cream-100/60 transition-all duration-300 rounded-sm"
              >
                {/* Mini photo */}
                <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-sm overflow-hidden">
                  <img
                    src={menuImages[activeCategory]?.[i] || menuImages[activeCategory]?.[0]}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-lg md:text-xl text-bordeaux-600 mb-1 group-hover:text-or-600 transition-colors duration-300">
                    {item.name}
                  </h4>
                  <p className="font-sans text-sm text-bordeaux-700/50 tracking-wide truncate">
                    {item.desc}
                  </p>
                </div>

                {/* Price */}
                <div className="flex-shrink-0">
                  <span className="font-serif text-lg md:text-xl text-or-500 font-medium">
                    {item.price}€
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <a href="#reservation" className="btn-primary">
            {t("nav.reserve")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
