"use client";

import Navbar from "./Navbar";
import Hero from "./Hero";
import Specialties from "./Specialties";
import MenuSection from "./MenuSection";
import Reviews from "./Reviews";
import OrderSection from "./OrderSection";
import ReservationSection from "./ReservationSection";
import Configurator from "./Configurator";
import Contact from "./Contact";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import PromoBanner from "./PromoBanner";

export default function HomePage() {
  return (
    <>
      <PromoBanner />
      <Navbar />
      <main>
        <Hero />
        <div className="gold-line" />
        <Specialties />
        <div className="gold-line" />
        <MenuSection />
        <div className="gold-line" />
        <Configurator />
        <div className="gold-line" />
        <Reviews />
        <div className="gold-line" />
        <OrderSection />
        <div className="gold-line" />
        <ReservationSection />
        <div className="gold-line" />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
