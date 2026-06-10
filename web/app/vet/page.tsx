"use client";

import { useState, useEffect } from "react";
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

export default function VetDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [statuses, setStatuses] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  // Sayfa açıldığında GERÇEK randevuları çek
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:8000/appointments");
        if (response.ok) {
          const data = await response.json();
          // Önceden onaylanmış randevuları ana ekranda gizlemek için filtreliyoruz
          const savedIds = JSON.parse(localStorage.getItem("acceptedAppointments") || "[]");
          const pendingAppointments = data.filter((appt: Appointment) => !savedIds.includes(appt.id));
          setAppointments(pendingAppointments);
        }
      } catch (error) {
        console.error("Randevular çekilirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleStatusChange = (id: number) => {
    setStatuses((prev) => ({ ...prev, [id]: "CONFIRMED" }));

    // Onaylanan randevunun ID'sini tarayıcı hafızasına kaydediyoruz
    const savedIds = JSON.parse(localStorage.getItem("acceptedAppointments") || "[]");
    if (!savedIds.includes(id)) {
      savedIds.push(id);
      localStorage.setItem("acceptedAppointments", JSON.stringify(savedIds));
    }

    alert("Randevu onaylandı! 'Onaylanan Randevularım' sekmesine eklenecektir.");
  };

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
    <div 
      className="flex min-h-[91vh] flex-col items-start justify-start p-6 bg-cover bg-center bg-no-repeat relative pl-10 md:pl-20 pt-16 md:pt-24"
      style={{ backgroundImage: `url(${vetDashboardBg})` }}
    >
      <div className="absolute inset-0 bg-black/40 pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-start">
        <div className="mb-8 w-full flex flex-col sm:flex-row justify-between items-center bg-black/30 p-6 rounded-2xl backdrop-blur-sm border border-white/10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white drop-shadow-md">🩺 Veteriner Yönetim Paneli</h1>
            <p className="text-slate-200 mt-1">Gelen randevu taleplerini inceleyin ve onaylayın.</p>
          </div>
          <Link href="/vet/accepted" className="px-6 py-3 bg-white text-emerald-700 font-extrabold rounded-xl hover:bg-emerald-50 transition-colors shadow-lg cursor-pointer">
            📋 Onaylanan Randevularım
          </Link>
        </div>

        {loading ? (
          <div className="w-full text-center py-10">
            <p className="text-white text-xl font-bold animate-pulse">Randevu talepleri yükleniyor...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="w-full bg-white/90 p-8 rounded-3xl shadow-xl text-center backdrop-blur-sm">
            <p className="text-slate-700 text-lg font-bold">Şu an için bekleyen bir randevu talebi bulunmuyor. 🩺</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {appointments.map((appt) => (
              <div key={appt.id} className="bg-white/95 p-6 rounded-3xl shadow-xl border border-slate-100 flex flex-col justify-between hover:shadow-2xl hover:scale-[1.02] transition-all backdrop-blur-sm text-left">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-slate-800">🐶 {appt.pet_name}</h2>
                    <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full">Beklemede</span>
                  </div>
                  {/* Sistem arka planından sadece ID geldiği için Sahip ID olarak ayarladık */}
                  <p className="text-sm text-slate-600 mb-2">👤 <span className="font-semibold">Müşteri ID:</span> {appt.owner_id}</p>
                  <p className="text-sm text-slate-600 mb-2">📍 <span className="font-semibold">Konum:</span> {appt.district.toUpperCase()} <br/><span className="text-xs text-slate-500 font-medium pl-5">{appt.address}</span></p>
                  <p className="text-sm text-slate-600 mb-2">📅 <span className="font-semibold">Tarih:</span> {formatDateTime(appt.date_time)}</p>
                  <p className="text-sm text-slate-600 mb-6">🩺 <span className="font-semibold">Şikayet:</span> {appt.reason}</p>
                </div>

                <div className="mt-auto">
                  {statuses[appt.id] === "CONFIRMED" ? (
                    <div className="bg-emerald-50 text-emerald-700 py-3 rounded-xl font-bold text-center border border-emerald-200 text-sm shadow-inner">
                      ✅ Randevu Onaylandı
                    </div>
                  ) : (
                    <button onClick={() => handleStatusChange(appt.id)} className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm text-sm cursor-pointer">
                      Onayla
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}