"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Köpek gezdirme temalı şık bir arka plan
const formBgUrl = "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&w=1200&q=80";

export default function NewWalkRequestPage() {
  const router = useRouter();
  const [ownerId, setOwnerId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Sayfa açıldığında giriş yapmış kullanıcının ID'sini hafızadan çek
  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) {
      setOwnerId(parseInt(id));
    } else {
      router.push("/login"); // ID yoksa gizlice girmeye çalışmıştır, geri yolla
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const requestBody = {
      owner_id: ownerId,
      pet_name: formData.get("pet_name")?.toString(),
      duration: formData.get("duration")?.toString(),
      district: formData.get("district")?.toString(),
      address: formData.get("address")?.toString(),
      price: parseFloat(formData.get("price")?.toString() || "0"),
    };

    try {
      // Backend'deki Yürüyüş İlanı köprümüze (API) veriyi yolluyoruz
      const response = await fetch("https://petapp-fj1j.onrender.com/walk-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        setErrorMsg("İlan oluşturulurken bir hata meydana geldi.");
        return;
      }

      alert("Yürüyüş ilanı başarıyla oluşturuldu! 🐶");
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
          <h1 className="text-2xl font-extrabold text-slate-900">Yürüyüş İlanı Aç 🦮</h1>
          <p className="text-sm text-slate-600 mt-1">Dostunuz için en iyi bakıcıyı bulun.</p>
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
              <input name="pet_name" type="text" required placeholder="Karabaş" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-800 mb-1">Yürüyüş Süresi</label>
              <select name="duration" required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white cursor-pointer">
                <option value="30 Dakika">30 Dakika</option>
                <option value="1 Saat">1 Saat</option>
                <option value="2 Saat">2 Saat</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">İlçe</label>
            <input name="district" type="text" required placeholder="Örn: Kadıköy" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Tam Adres veya Buluşma Noktası</label>
            <textarea name="address" required rows={3} placeholder="Yoğurtçu Parkı, giriş kapısı..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white resize-none" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Teklif Edilen Ücret (₺)</label>
            <input name="price" type="number" required min="50" step="10" placeholder="250" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white" />
          </div>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={() => router.push('/owner')} className="flex-1 bg-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-300 transition-colors text-sm">
              İptal
            </button>
            <button type="submit" className="flex-[2] bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md text-sm">
              İlanı Yayınla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}