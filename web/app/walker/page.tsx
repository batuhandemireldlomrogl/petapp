"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; 

const walkerBg = "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80";

// Veritabanımızdan (schemas.py) gelecek olan verinin şablonu
interface WalkRequest {
  id: number;
  pet_name: string;
  duration: string;
  district: string;
  address: string;
  price: number;
  status: string;
}

export default function WalkerDashboard() {
  const [requests, setRequests] = useState<WalkRequest[]>([]);
  const [acceptedJob, setAcceptedJob] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Sayfa açıldığında GERÇEK ilanları Python'dan (Veritabanından) Çek
  useEffect(() => {
    const fetchWalkRequests = async () => {
      try {
        const response = await fetch("https://petapp-fj1j.onrender.com/walk-requests");
        if (response.ok) {
          const data = await response.json();
          // Sadece 'PENDING' (Bekleyen) statüsündeki ilanları filtreleyip gösteriyoruz
          const pendingRequests = data.filter((req: WalkRequest) => req.status === "PENDING");
          setRequests(pendingRequests);
        }
      } catch (error) {
        console.error("İlanlar çekilirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalkRequests();
  }, []);

  // Şimdilik sadece görsel olarak işi kabul etme efekti (İleride backend'e bağlanabilir)
  const handleAccept = (id: number) => {
    setAcceptedJob(id);
    
    // YENİ: Kabul edilen işin ID'sini tarayıcı hafızasına (localStorage) ekliyoruz
    const savedIds = JSON.parse(localStorage.getItem("acceptedWalks") || "[]");
    if (!savedIds.includes(id)) {
      savedIds.push(id);
      localStorage.setItem("acceptedWalks", JSON.stringify(savedIds));
    }

    alert("İlan kabul edildi! Kabul ettiğim işler sekmesine eklenecektir.");
  };

  return (
    <div 
      className="flex min-h-[91vh] flex-col items-start justify-start p-6 bg-cover bg-center bg-no-repeat relative pl-10 md:pl-20 pt-16 md:pt-24"
      style={{ backgroundImage: `url(${walkerBg})` }}
    >
      <div className="absolute inset-0 bg-black/40 pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-start">
        
        {/* ÜST KISIM (BAŞLIK VE BUTON) */}
        <div className="mb-8 w-full flex flex-col sm:flex-row justify-between items-center bg-black/30 p-6 rounded-2xl backdrop-blur-sm border border-white/10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white drop-shadow-md">🦮 Hayvan Bakıcısı Paneli</h1>
            <p className="text-slate-200 mt-1">Bölgendeki yürüyüş taleplerini incele ve kabul et.</p>
          </div>
          <Link href="/walker/accepted" className="px-6 py-3 bg-white text-purple-700 font-extrabold rounded-xl hover:bg-purple-50 transition-colors shadow-lg cursor-pointer">
            📋 Kabul Ettiğim İşler
          </Link>
        </div>

        {/* GERÇEK İLANLARIN LİSTELENDİĞİ KISIM */}
        {loading ? (
          <div className="w-full text-center py-10">
            <p className="text-white text-xl font-bold animate-pulse">Gerçek ilanlar yükleniyor...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="w-full bg-white/90 p-8 rounded-3xl shadow-xl text-center backdrop-blur-sm">
            <p className="text-slate-700 text-lg font-bold">Şu an için yayında olan yeni bir yürüyüş ilanı bulunmuyor. 🐾</p>
            <p className="text-slate-500 text-sm mt-2">Evcil hayvan sahipleri ilan açtıkça burada belirecektir.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {requests.map((job) => (
              <div key={job.id} className="bg-white/95 p-6 rounded-3xl shadow-xl border border-slate-100 flex flex-col justify-between hover:shadow-2xl hover:scale-[1.02] transition-all backdrop-blur-sm text-left">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-slate-800">🐶 {job.pet_name}</h2>
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">Yeni İlan</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">📍 <span className="font-semibold">Konum:</span> {job.district.toUpperCase()} <br/><span className="text-xs text-slate-500 font-medium pl-5">{job.address}</span></p>
                  <p className="text-sm text-slate-600 mb-2">⏱️ <span className="font-semibold">Süre:</span> {job.duration}</p>
                  <p className="text-sm text-slate-600 mb-6">💰 <span className="font-semibold">Ücret:</span> {job.price} TL</p>
                </div>

                {acceptedJob === job.id ? (
                  <div className="bg-emerald-50 text-emerald-700 py-3 rounded-xl font-bold text-center border border-emerald-200 text-sm shadow-inner">
                    ✅ İş Kabul Edildi
                  </div>
                ) : (
                  <button 
                    onClick={() => handleAccept(job.id)}
                    className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors shadow-md text-sm cursor-pointer"
                  >
                    İşi Kabul Et
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}