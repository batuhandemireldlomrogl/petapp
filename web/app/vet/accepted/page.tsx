"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const vetDashboardBg = "https://images.unsplash.com/photo-1596272875729-ed2ff7d6d9c5?auto=format&fit=crop&w=1200&q=80";

// Python'dan gelecek randevu verisinin şablonu
interface Appointment {
  id: number;
  owner_id: number;
  pet_name: string;
  district: string;
  address: string;
  date_time: string;
  reason: string;
}

export default function AcceptedAppointments() {
  const [acceptedAppointments, setAcceptedAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcceptedAppointments = async () => {
      try {
        // 1. Tarayıcı hafızasından (localStorage) onaylanan randevu ID'lerini çek
        const savedIds = JSON.parse(localStorage.getItem("acceptedAppointments") || "[]");

        if (savedIds.length === 0) {
          setLoading(false);
          return;
        }

        // 2. Python backend'den tüm randevuları getir
        const response = await fetch("http://localhost:8000/appointments");
        if (response.ok) {
          const allData = await response.json();
          // 3. Sadece hafızadaki ID'ler ile eşleşen randevuları filtrele
          const myAppointments = allData.filter((appt: Appointment) => savedIds.includes(appt.id));
          setAcceptedAppointments(myAppointments);
        }
      } catch (error) {
        console.error("Randevular çekilirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedAppointments();
  }, []);

  // Tarih formatını daha okunaklı hale getiren yardımcı fonksiyon
  const formatDateTime = (dateTimeStr: string) => {
    try {
      const date = new Date(dateTimeStr);
      return date.toLocaleString("tr-TR", { dateStyle: "long", timeStyle: "short" });
    } catch {
      return dateTimeStr;
    }
  };

  return (
    <div className="flex min-h-[91vh] flex-col items-start justify-start p-6 bg-cover bg-center bg-no-repeat relative pl-10 md:pl-20 pt-16 md:pt-24" style={{ backgroundImage: `url(${vetDashboardBg})` }}>
      <div className="absolute inset-0 bg-black/50 pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-start">
        {/* ÜST BİLGİ ALANI */}
        <div className="mb-8 w-full flex flex-col sm:flex-row justify-between items-center bg-black/30 p-6 rounded-2xl backdrop-blur-sm border border-white/10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-emerald-400 drop-shadow-md">✅ Onaylanan Randevularım</h1>
            <p className="text-slate-200 mt-1">Kesinleşen ve ilgileneceğiniz hastalarınız.</p>
          </div>
          <Link href="/vet" className="px-6 py-3 bg-white text-slate-800 font-extrabold rounded-xl hover:bg-slate-100 transition-colors shadow-lg">
            ⟲ Panele Dön
          </Link>
        </div>

        {/* LİSTELEME ALANI */}
        {loading ? (
          <div className="bg-white/95 p-8 rounded-3xl shadow-xl w-full text-center">
            <p className="text-slate-500 font-bold animate-pulse">Randevularınız yükleniyor...</p>
          </div>
        ) : acceptedAppointments.length === 0 ? (
          <div className="bg-white/95 p-8 rounded-3xl shadow-xl w-full text-center">
            <p className="text-slate-500 font-medium">Şu an için onaylanmış bir randevunuz bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {acceptedAppointments.map((appt) => (
              <div key={appt.id} className="bg-emerald-50 p-6 rounded-3xl shadow-xl border border-emerald-200 flex flex-col justify-between hover:shadow-2xl transition-all text-left">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-emerald-900">🐶 {appt.pet_name}</h2>
                    <span className="bg-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">Onaylı Randevu</span>
                  </div>
                  <p className="text-sm text-slate-700 mb-2">👤 <span className="font-semibold">Müşteri ID:</span> {appt.owner_id}</p>
                  <p className="text-sm text-slate-700 mb-2">📍 <span className="font-semibold">Konum:</span> {appt.district.toUpperCase()}</p>
                  <p className="text-sm text-slate-700 mb-2">📅 <span className="font-semibold">Tarih:</span> {formatDateTime(appt.date_time)}</p>
                  <p className="text-sm text-slate-700 mb-4">🩺 <span className="font-semibold">Şikayet:</span> {appt.reason}</p>
                </div>
                
                <div className="w-full bg-white text-emerald-700 py-3 rounded-xl font-bold text-center border border-emerald-200 text-sm shadow-sm mt-4">
                  Tedavi Sorumluluğunuzda
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}