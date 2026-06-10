"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Veteriner temalı şık bir arka plan
const formBgUrl = "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=1200&q=80";

export default function NewAppointmentPage() {
  const router = useRouter();
  const [ownerId, setOwnerId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Sayfa açıldığında giriş yapmış kullanıcının ID'sini hafızadan çek
  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) {
      setOwnerId(parseInt(id));
    } else {
      router.push("/login"); // Güvenlik kontrolü
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    
    // schemas.py içindeki AppointmentCreate şablonumuza birebir uygun veri hazırlıyoruz
    const requestBody = {
      owner_id: ownerId,
      pet_name: formData.get("pet_name")?.toString(),
      district: formData.get("district")?.toString(),
      address: formData.get("address")?.toString(),
      date_time: formData.get("date_time")?.toString(),
      reason: formData.get("reason")?.toString(),
    };

    try {
      // Backend'deki Randevu köprümüze (API) veriyi yolluyoruz
      const response = await fetch("http://localhost:8000/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        setErrorMsg("Randevu oluşturulurken bir hata meydana geldi.");
        return;
      }

      alert("Randevunuz başarıyla oluşturuldu! 🩺");
      router.push("/owner"); // İşlem bitince ana panele geri dön

    } catch (error) {
      setErrorMsg("Sunucuya bağlanılamadı. Lütfen arka planın çalıştığından emin olun.");
    }
  };

  return (
    <div 
      className="flex min-h-[91vh] flex-row items-center justify-start p-6 bg-cover bg-center bg-no-repeat relative pl-10 md:pl-20"
      style={{ backgroundImage: `url(${formBgUrl})` }}
    >
      <div className="absolute inset-0 bg-black/40 pointer-events-none z-0"></div>

      <div className="w-full max-w-lg bg-white/90 p-8 rounded-3xl shadow-2xl border border-slate-100 relative z-10 backdrop-blur-sm">
        <div className="mb-6 border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-extrabold text-slate-900">Veteriner Randevusu Al 🩺</h1>
          <p className="text-sm text-slate-600 mt-1">Dostunuzun sağlığı için hekiminizden randevu talep edin.</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-800 mb-1">Evcil Hayvan Adı</label>
              <input name="pet_name" type="text" required placeholder="Boncuk" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-800 mb-1">Randevu Tarihi ve Saati</label>
              {/* datetime-local ile kullanıcıya şık bir takvim sunuyoruz */}
              <input name="date_time" type="datetime-local" required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white cursor-pointer" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Klinik İlçesi (Örn: Beşiktaş)</label>
            <input name="district" type="text" required placeholder="Hangi ilçede veteriner arıyorsunuz?" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Ev Adresiniz (veya Klinik Adresi)</label>
            <textarea name="address" required rows={2} placeholder="Tam adresinizi belirtin..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white resize-none" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Randevu Sebebi</label>
            <textarea name="reason" required rows={2} placeholder="Yıllık karma aşı, genel muayene vb." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white resize-none" />
          </div>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={() => router.push('/owner')} className="flex-1 bg-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-300 transition-colors text-sm">
              İptal
            </button>
            <button type="submit" className="flex-[2] bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-md text-sm">
              Randevu Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}