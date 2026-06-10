"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Python'dan gelecek veteriner verisinin şablonu
interface PendingVet {
  id: number;
  full_name: string;
  email: string;
  tc_no: string;
  diploma_url: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [pendingVets, setPendingVets] = useState<PendingVet[]>([]);
  const [lastAction, setLastAction] = useState("");

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");

    if (userRole !== "admin") {
      alert("Bu sayfaya erişim yetkiniz yoktur! Yalnızca sistem yöneticileri girebilir.");
      router.push("/");
    } else {
      setIsLoading(false);
      fetchPendingVets();
    }
  }, [router]);

  const fetchPendingVets = async () => {
    try {
      const response = await fetch("https://petapp-fj1j.onrender.com/admin/pending-vets");
      if (response.ok) {
        const data = await response.json();
        setPendingVets(data);
      }
    } catch (error) {
      console.error("Veriler çekilirken hata oluştu:", error);
    }
  };

  const handleAction = async (id: number, action: "APPROVE" | "REJECT") => {
    if (action === "APPROVE") {
      try {
        const response = await fetch(`https://petapp-fj1j.onrender.com/admin/approve-vet/${id}`, {
          method: "PUT",
        });

        if (response.ok) {
          setPendingVets(pendingVets.filter(vet => vet.id !== id));
          setLastAction("Kayıt başarıyla onaylandı. Veteriner artık giriş yapabilir.");
        }
      } catch (error) {
        console.error("Onaylama işlemi başarısız oldu:", error);
      }
    } else {
      // YENİ: REDDETME İŞLEMİ (GERÇEK VERİTABANI BAĞLANTISI İLE SİLME)
      try {
        const response = await fetch(`https://petapp-fj1j.onrender.com/admin/reject-vet/${id}`, {
          method: "DELETE", // Python'daki delete metodunu tetikliyoruz
        });

        if (response.ok) {
          // Başarılı olursa ekrandan kaldır ve kalıcı olarak silindiğini bildir
          setPendingVets(pendingVets.filter(vet => vet.id !== id));
          setLastAction("Kayıt reddedildi ve veritabanından kalıcı olarak silindi.");
        }
      } catch (error) {
        console.error("Reddetme işlemi başarısız oldu:", error);
      }
    }
  };

  if (isLoading) {
    return <div className="text-center mt-20 font-bold text-slate-500">Güvenlik kontrolü yapılıyor...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">🛡️ Admin Kontrol Paneli</h1>
          <p className="text-slate-600">Sisteme kayıt olmak isteyen veterinerlerin belgelerini onaylayın.</p>
        </div>
        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold">
          {pendingVets.length} Bekleyen Talep
        </div>
      </div>

      {lastAction && (
        <div className="mb-6 p-4 bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 font-medium">
          ✅ {lastAction}
        </div>
      )}

      {pendingVets.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-500 font-medium text-lg">Onay bekleyen veteriner kaydı bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Veteriner Hekim</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">T.C. Kimlik / E-posta</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Belge</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingVets.map((vet) => (
                <tr key={vet.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{vet.full_name}</div>
                    <div className="text-xs text-slate-500">Talep: Yeni Talep</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700 font-medium">{vet.tc_no}</div>
                    <div className="text-sm text-slate-500">{vet.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    {/* YENİ: Gerçek dosya yolunu Python'dan çekip ekranda açan link */}
                    <a 
                      href={`https://petapp-fj1j.onrender.com${vet.diploma_url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm font-bold hover:underline flex items-center gap-1 cursor-pointer inline-block"
                    >
                      📄 Belgeyi Gör
                    </a>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleAction(vet.id, "APPROVE")}
                        className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
                      >
                        Onayla
                      </button>
                      <button 
                        onClick={() => handleAction(vet.id, "REJECT")}
                        className="px-4 py-2 bg-white text-red-600 border border-red-200 text-sm font-bold rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        Reddet
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}