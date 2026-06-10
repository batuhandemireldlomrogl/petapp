"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const walkerBg = "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80";

// Şablonumuz
interface WalkRequest {
  id: number;
  pet_name: string;
  duration: string;
  district: string;
  address: string;
  price: number;
}

export default function AcceptedJobs() {
  const [acceptedJobs, setAcceptedJobs] = useState<WalkRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcceptedJobs = async () => {
      try {
        // 1. Tarayıcı hafızasından kabul edilen işlerin ID'lerini çek
        const savedIds = JSON.parse(localStorage.getItem("acceptedWalks") || "[]");

        if (savedIds.length === 0) {
          setLoading(false);
          return;
        }

        // 2. Python backend'den tüm ilanları getir
        const response = await fetch("http://localhost:8000/walk-requests");
        if (response.ok) {
          const allData = await response.json();
          // 3. Sadece hafızadaki ID'ler ile eşleşen ilanları filtrele
          const myJobs = allData.filter((req: WalkRequest) => savedIds.includes(req.id));
          setAcceptedJobs(myJobs);
        }
      } catch (error) {
        console.error("İlanlar çekilirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedJobs();
  }, []);

  return (
    <div className="flex min-h-[91vh] flex-col items-start justify-start p-6 bg-cover bg-center bg-no-repeat relative pl-10 md:pl-20 pt-16 md:pt-24" style={{ backgroundImage: `url(${walkerBg})` }}>
      <div className="absolute inset-0 bg-black/50 pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-start">
        {/* ÜST BİLGİ ALANI */}
        <div className="mb-8 w-full flex flex-col sm:flex-row justify-between items-center bg-black/30 p-6 rounded-2xl backdrop-blur-sm border border-white/10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-purple-400 drop-shadow-md">✅ Kabul Ettiğim İşler</h1>
            <p className="text-slate-200 mt-1">Sorumluluğunu aldığınız yürüyüş görevleri.</p>
          </div>
          <Link href="/walker" className="px-6 py-3 bg-white text-slate-800 font-extrabold rounded-xl hover:bg-slate-100 transition-colors shadow-lg">
            ⟲ Panele Dön
          </Link>
        </div>

        {/* LİSTELEME ALANI */}
        {loading ? (
          <div className="bg-white/95 p-8 rounded-3xl shadow-xl w-full text-center">
            <p className="text-slate-500 font-bold animate-pulse">İşleriniz yükleniyor...</p>
          </div>
        ) : acceptedJobs.length === 0 ? (
          <div className="bg-white/95 p-8 rounded-3xl shadow-xl w-full text-center">
            <p className="text-slate-500 font-medium">Şu an için kabul ettiğiniz bir iş bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {acceptedJobs.map((job) => (
              <div key={job.id} className="bg-emerald-50 p-6 rounded-3xl shadow-xl border border-emerald-200 flex flex-col justify-between hover:shadow-2xl transition-all text-left">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-emerald-900">🐶 {job.pet_name}</h2>
                    <span className="bg-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">Aktif Görev</span>
                  </div>
                  <p className="text-sm text-slate-700 mb-2">📍 <span className="font-semibold">Konum:</span> {job.district}</p>
                  <p className="text-sm text-slate-700 mb-2">⏱️ <span className="font-semibold">Süre:</span> {job.duration}</p>
                  <p className="text-sm text-slate-700 mb-4">💰 <span className="font-semibold">Kazanç:</span> {job.price} TL</p>
                </div>
                
                <div className="w-full bg-white text-emerald-700 py-3 rounded-xl font-bold text-center border border-emerald-200 text-sm shadow-sm">
                  Görev Sorumluluğunuzda
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}