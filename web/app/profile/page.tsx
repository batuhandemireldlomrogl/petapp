"use client";

import { useEffect, useState } from "react";

const profileBg = "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80";

export default function ProfilePage() {
  const [role, setRole] = useState<string | null>("");
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // YENİ: Şifre alanını hafızada tutmak için
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(""); // YENİ: Hataları ekranda göstermek için

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    const storedUserId = localStorage.getItem("userId");
    
    setRole(storedRole);

    const fetchUserProfile = async () => {
      if (!storedUserId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/users/${storedUserId}`);
        if (response.ok) {
          const data = await response.json();
          setName(data.full_name);
          setEmail(data.email);
        }
      } catch (error) {
        console.error("Profil bilgileri çekilirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const roleNames: Record<string, string> = {
    owner: "Evcil Hayvan Sahibi",
    vet: "Veteriner Hekim",
    walker: "Hayvan Bakıcısı",
    admin: "Sistem Yöneticisi"
  };

  // GERÇEK GÜNCELLEME İŞLEMİ (PYTHON API BAĞLANTISI)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const storedUserId = localStorage.getItem("userId");

    try {
      const response = await fetch(`http://localhost:8000/users/${storedUserId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: name,
          email: email,
          password: password || null, // Şifre boşsa null gidiyor, Python güncellemiyor
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.detail || "Güncelleme sırasında bir hata oluştu.");
        return;
      }

      // Başarılıysa yerel hafızadaki ismi de güncelle ve düzenleme modunu kapat
      localStorage.setItem("userName", name);
      setIsEditing(false);
      setPassword(""); // Güvenlik için şifre state'ini temizle
      alert("Bilgileriniz ve şifreniz veritabanında başarıyla güncellendi! 🔐");
    } catch (error) {
      setErrorMsg("Sunucuya bağlanılamadı. Lütfen arka planın çalıştığından emin olun.");
    }
  };

  return (
    <div 
      className="flex min-h-[91vh] flex-col items-center justify-center p-6 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${profileBg})` }}
    >
      <div className="absolute inset-0 bg-black/50 pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-lg bg-white/95 p-10 rounded-3xl shadow-2xl backdrop-blur-sm text-center">
        <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-inner">
          👤
        </div>

        {loading ? (
          <p className="text-slate-500 font-bold animate-pulse mt-4">Kullanıcı bilgi kütüphanesi yükleniyor...</p>
        ) : isEditing ? (
          <form onSubmit={handleSave} className="flex flex-col gap-4 text-left mt-4">
            <h2 className="text-xl font-extrabold text-slate-800 text-center mb-2">Profili Düzenle</h2>
            
            {/* Hata Mesajı Kutusu */}
            {errorMsg && (
              <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-xs rounded-xl font-medium text-center">
                ⚠️ {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Adınız Soyadınız</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white text-sm" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">E-posta Adresiniz</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white text-sm" />
            </div>

            {/* ŞİFRE KUTUSU ARTIK AKILLI (STATE'E BAĞLI) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Yeni Şifre (İsteğe Bağlı)</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Şifreniz en az 8 karakter uzunluğunda olmalı; en az bir büyük harf, bir küçük harf ve bir rakam içermelidir."
                placeholder="Değiştirmek istemiyorsanız boş bırakın" 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white text-sm" 
              />
            </div>

            <div className="flex gap-3 mt-4">
              <button type="button" onClick={() => { setIsEditing(false); setPassword(""); }} className="flex-1 bg-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-300 transition-colors text-sm cursor-pointer">
                İptal Et
              </button>
              <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md text-sm cursor-pointer">
                Kaydet
              </button>
            </div>
          </form>
        ) : (
          <>
            <h1 className="text-3xl font-extrabold text-slate-800 mb-1">
              {name ? name : "Kullanıcı Adı"}
            </h1>
            <p className="text-blue-600 font-bold mb-6">
              {role ? roleNames[role] : "Kullanıcı"}
            </p>
            
            <div className="space-y-4 text-left border-t border-slate-200 pt-6">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">E-posta</p>
                <p className="font-medium text-slate-800">{email}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Kayıt Tarihi</p>
                <p className="font-medium text-slate-800">Mayıs 2026</p>
              </div>
            </div>

            <button onClick={() => setIsEditing(true)} className="mt-8 w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition-colors shadow-md text-sm cursor-pointer">
              Bilgileri Güncelle
            </button>
          </>
        )}
      </div>
    </div>
  );
}