"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const ownerDashboardBg = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80";

export default function OwnerDashboard() {
  const [userName, setUserName] = useState("Evcil Hayvan Sahibi");

  // YENİ: Sayfa yüklendiğinde hafızadaki ismi al
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
  }, []);

  return (
    <div 
      className="flex min-h-[91vh] flex-col items-start justify-start p-6 bg-cover bg-center bg-no-repeat relative pl-10 md:pl-20 pt-16 md:pt-24"
      style={{ backgroundImage: `url(${ownerDashboardBg})` }}
    >
      <div className="absolute inset-0 bg-black/50 pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-start">
        <div className="mb-12 text-left bg-black/30 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
          {/* YENİ: Dinamik İsim */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">Hoş Geldiniz, {userName} 👋</h1>
          <p className="text-lg text-slate-200 mt-2 drop-shadow-md">Bugün sevimli dostunuz için ne yapmak istersiniz?</p>
        </div>

        {/* Kartlar dikey düzende ve sola yaslı */}
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-3xl">
          
          {/* Seçenek 1: Yürüyüş Talebi */}
          <Link href="/owner/new-walk" className="flex-1 group p-8 bg-white/90 rounded-3xl shadow-2xl border border-white/20 hover:shadow-xl transition-all duration-300 flex flex-col items-start text-left backdrop-blur-sm hover:scale-105 cursor-pointer">
            <div className="text-7xl mb-4 group-hover:scale-110 transition-transform">🦮</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Yürüyüş Talebi Oluştur</h2>
            <p className="text-slate-600 text-sm">Güvenilir bir bakıcı bulun ve yürüyüş için ilan yayınlayın.</p>
            <div className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs transition-all shadow-md">
              Hemen Başla →
            </div>
          </Link>

          {/* Seçenek 2: Veteriner Randevusu */}
          <Link href="/owner/new-appointment" className="flex-1 group p-8 bg-white/90 rounded-3xl shadow-2xl border border-white/20 hover:shadow-xl transition-all duration-300 flex flex-col items-start text-left backdrop-blur-sm hover:scale-105 cursor-pointer">
            <div className="text-7xl mb-4 group-hover:scale-110 transition-transform">🩺</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Veteriner Randevusu Al</h2>
            <p className="text-slate-600 text-sm">Hekimden randevu talep edin ve hayvanınızın sağlık durumunu yönetin.</p>
            <div className="mt-6 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs transition-all shadow-md">
              Talep Oluştur →
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}