"use client";

import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat, UtensilsCrossed, IceCreamCone, Coffee, ShoppingBag, ArrowRight, ArrowLeft, Check, RotateCcw } from "lucide-react";

type Step = "entree" | "plat" | "dessert" | "boisson" | "recap";

type ConfigItem = { id: string; label: string; price: number };

const stepIcons: Record<string, React.ReactNode> = {
  entree: <UtensilsCrossed className="w-5 h-5" />,
  plat: <ChefHat className="w-5 h-5" />,
  dessert: <IceCreamCone className="w-5 h-5" />,
  boisson: <Coffee className="w-5 h-5" />,
  recap: <ShoppingBag className="w-5 h-5" />,
};

const stepKeys: Step[] = ["entree", "plat", "dessert", "boisson", "recap"];

export default function Configurator() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [currentStep, setCurrentStep] = useState<Step>("entree");
  const [selectedEntree, setSelectedEntree] = useState<string | null>(null);
  const [selectedPlat, setSelectedPlat] = useState<string | null>(null);
  const [selectedDessert, setSelectedDessert] = useState<string | null>(null);
  const [selectedBoisson, setSelectedBoisson] = useState<string | null>(null);
  const [ordered, setOrdered] = useState(false);

  const entrees = t("configurator.entrees", { returnObjects: true }) as ConfigItem[];
  const plats = t("configurator.plats", { returnObjects: true }) as ConfigItem[];
  const dessertsList = t("configurator.desserts_list", { returnObjects: true }) as ConfigItem[];
  const boissonsList = t("configurator.boissons", { returnObjects: true }) as ConfigItem[];
  const formulaPrice = Number(t("configurator.formula_price")) || 0;

  const stepIndex = stepKeys.indexOf(currentStep);

  const getTotal = () => {
    let total = formulaPrice;
    const entree = entrees.find((e) => e.id === selectedEntree);
    const plat = plats.find((p) => p.id === selectedPlat);
    const dessert = dessertsList.find((d) => d.id === selectedDessert);
    const boisson = boissonsList.find((b) => b.id === selectedBoisson);
    if (entree) total += entree.price;
    if (plat) total += plat.price;
    if (dessert) total += dessert.price;
    if (boisson) total += boisson.price;
    return total.toFixed(2);
  };

  const canNext = () => {
    if (currentStep === "entree") return !!selectedEntree;
    if (currentStep === "plat") return !!selectedPlat;
    if (currentStep === "dessert") return !!selectedDessert;
    return true;
  };

  const next = () => {
    if (stepIndex < stepKeys.length - 1) setCurrentStep(stepKeys[stepIndex + 1]);
  };

  const prev = () => {
    if (stepIndex > 0) setCurrentStep(stepKeys[stepIndex - 1]);
  };

  const reset = () => {
    setSelectedEntree(null);
    setSelectedPlat(null);
    setSelectedDessert(null);
    setSelectedBoisson(null);
    setCurrentStep("entree");
    setOrdered(false);
  };

  const handleOrder = () => {
    setOrdered(true);
    setTimeout(() => setOrdered(false), 3000);
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as const },
    }),
  };

  const renderOptions = (
    items: ConfigItem[],
    selected: string | null,
    onSelect: (id: string) => void,
    title: string,
    subtitle?: string
  ) => (
    <motion.div
      key={currentStep}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4 }}
      className="space-y-3"
    >
      <h3 className="font-serif text-2xl text-bordeaux-600 mb-2">{title}</h3>
      {subtitle && <p className="font-sans text-sm text-bordeaux-500/50 mb-6">{subtitle}</p>}
      {!subtitle && <div className="mb-6" />}
      {items.map((item, i) => (
        <motion.button
          key={item.id}
          custom={i}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          onClick={() => onSelect(item.id)}
          className={`w-full flex items-center justify-between p-5 border transition-all duration-300
            ${selected === item.id
              ? "border-or-400 bg-or-400/10 shadow-lg shadow-or-400/10"
              : "border-cream-300/50 hover:border-or-300 bg-white/60"
            }`}
        >
          <span className="font-serif text-lg text-bordeaux-600">{item.label}</span>
          <span className="font-sans text-sm text-or-500 font-medium">
            {item.price > 0 ? `+${item.price.toFixed(2)}€` : t("configurator.included")}
          </span>
        </motion.button>
      ))}
    </motion.div>
  );

  return (
    <section ref={sectionRef} className="section-padding bg-cream-50" id="configurator">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-or-400" />
            <ChefHat className="w-4 h-4 text-or-400" />
            <div className="w-12 h-px bg-or-400" />
          </div>
          <h2 className="heading-luxury mb-4">{t("configurator.title")}</h2>
          <p className="text-elegant">{t("configurator.subtitle")}</p>
        </motion.div>

        {/* Progress bar */}
        <div className="flex items-center justify-between mb-12 px-4">
          {stepKeys.map((key, i) => (
            <div key={key} className="flex items-center">
              <button
                onClick={() => {
                  if (i <= stepIndex) setCurrentStep(key);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-sm transition-all duration-300
                  ${i <= stepIndex ? "text-bordeaux-600" : "text-bordeaux-400/40"}`}
              >
                <div
                  className={`w-9 h-9 flex items-center justify-center border transition-all duration-300
                    ${i < stepIndex
                      ? "bg-bordeaux-600 border-bordeaux-600 text-cream-50"
                      : i === stepIndex
                        ? "border-or-400 text-or-500 bg-or-400/10"
                        : "border-cream-400 text-cream-400"
                    }`}
                >
                  {i < stepIndex ? <Check className="w-4 h-4" /> : stepIcons[key]}
                </div>
                <span className="hidden md:inline font-sans text-xs tracking-[0.1em] uppercase">
                  {t(`configurator.steps.${key}`)}
                </span>
              </button>
              {i < stepKeys.length - 1 && (
                <div
                  className={`hidden sm:block w-8 md:w-16 h-px mx-1 transition-colors duration-300
                    ${i < stepIndex ? "bg-bordeaux-600" : "bg-cream-300"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="min-h-[380px]">
          <AnimatePresence mode="wait">
            {currentStep === "entree" &&
              renderOptions(entrees, selectedEntree, setSelectedEntree, t("configurator.choose_entree"))}

            {currentStep === "plat" &&
              renderOptions(plats, selectedPlat, setSelectedPlat, t("configurator.choose_plat"))}

            {currentStep === "dessert" &&
              renderOptions(dessertsList, selectedDessert, setSelectedDessert, t("configurator.choose_dessert"))}

            {currentStep === "boisson" &&
              renderOptions(boissonsList, selectedBoisson, (id) => {
                setSelectedBoisson(selectedBoisson === id ? null : id);
              }, t("configurator.choose_boisson"), t("configurator.optional"))}

            {/* RECAP */}
            {currentStep === "recap" && (
              <motion.div
                key="recap"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="font-serif text-2xl text-bordeaux-600 mb-8">{t("configurator.your_order")}</h3>
                <div className="bg-white/60 border border-or-200/50 p-8 space-y-4">
                  <div className="flex justify-between py-3 border-b border-cream-300/40">
                    <span className="font-sans text-sm text-bordeaux-700/60 uppercase tracking-wide">
                      {t("configurator.steps.entree")}
                    </span>
                    <span className="font-serif text-lg text-bordeaux-600">
                      {entrees.find((e) => e.id === selectedEntree)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-cream-300/40">
                    <span className="font-sans text-sm text-bordeaux-700/60 uppercase tracking-wide">
                      {t("configurator.steps.plat")}
                    </span>
                    <span className="font-serif text-lg text-bordeaux-600">
                      {plats.find((p) => p.id === selectedPlat)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-cream-300/40">
                    <span className="font-sans text-sm text-bordeaux-700/60 uppercase tracking-wide">
                      {t("configurator.steps.dessert")}
                    </span>
                    <span className="font-serif text-lg text-bordeaux-600">
                      {dessertsList.find((d) => d.id === selectedDessert)?.label}
                    </span>
                  </div>
                  {selectedBoisson && (
                    <div className="flex justify-between py-3 border-b border-cream-300/40">
                      <span className="font-sans text-sm text-bordeaux-700/60 uppercase tracking-wide">
                        {t("configurator.steps.boisson")}
                      </span>
                      <span className="font-serif text-lg text-bordeaux-600">
                        {boissonsList.find((b) => b.id === selectedBoisson)?.label}
                      </span>
                    </div>
                  )}
                  {/* Total */}
                  <div className="flex justify-between pt-4">
                    <span className="font-serif text-xl text-bordeaux-600 font-medium">{t("configurator.total")}</span>
                    <motion.span
                      key={getTotal()}
                      initial={{ scale: 1.3, color: "#C9A96E" }}
                      animate={{ scale: 1, color: "#6B1D2A" }}
                      transition={{ duration: 0.4 }}
                      className="font-serif text-3xl font-bold"
                    >
                      {getTotal()}€
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Prix live + Navigation */}
        <div className="mt-10 flex items-center justify-between">
          {currentStep !== "recap" && (
            <div className="flex items-center gap-2">
              <span className="font-sans text-xs tracking-[0.1em] uppercase text-bordeaux-500/50">
                {t("configurator.total")}
              </span>
              <motion.span
                key={getTotal()}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-serif text-2xl text-or-500 font-bold"
              >
                {getTotal()}€
              </motion.span>
            </div>
          )}
          {currentStep === "recap" && (
            <button
              onClick={reset}
              className="flex items-center gap-2 font-sans text-sm text-bordeaux-500/60 hover:text-bordeaux-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              {t("configurator.restart")}
            </button>
          )}

          <div className="flex gap-3">
            {stepIndex > 0 && (
              <button onClick={prev} className="btn-outline text-xs flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                {t("configurator.back")}
              </button>
            )}
            {currentStep !== "recap" ? (
              <button
                onClick={next}
                disabled={!canNext()}
                className={`btn-primary text-xs flex items-center gap-2
                  ${!canNext() ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                {t("configurator.next")}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <motion.button
                onClick={handleOrder}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-8 py-3.5 font-sans text-sm tracking-[0.15em] uppercase font-medium transition-all duration-500
                  flex items-center gap-2
                  ${ordered
                    ? "bg-green-600 text-white"
                    : "bg-or-400 text-bordeaux-800 hover:bg-or-300 hover:shadow-lg hover:shadow-or-400/20"
                  }`}
              >
                {ordered ? (
                  <>
                    <Check className="w-4 h-4" />
                    {t("configurator.ordered")}
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    {t("configurator.order")}
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
