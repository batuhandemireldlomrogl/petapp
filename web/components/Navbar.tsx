"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  // Sayfa her değiştiğinde kullanıcının giriş yapıp yapmadığını kontrol et
  useEffect(() => {
    setRole(localStorage.getItem("userRole"));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("userRole"); // Hafızadaki rolü sil
    router.push("/login"); // Giriş sayfasına fırlat
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">🐾</span>
            <span className="font-extrabold text-xl text-slate-800">PetApp</span>
          </Link>

          {/* SAĞ TARAF: Dinamik Menü */}
          <div className="flex items-center gap-6">
            {role && role !== "admin" && (
              <Link href="/profile" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
                👤 Profilim
              </Link>
            )}
            {role && (
              <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer">
                🚪 Çıkış Yap
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}