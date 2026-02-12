"use client";

import { useEffect, useState } from "react";
import "@/i18n";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-or-400 border-t-transparent rounded-full animate-spin" />
          <p className="font-serif text-lg text-bordeaux-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
