"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const formBgUrl = "https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "owner";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tcNo, setTcNo] = useState("");
  const [diplomaFile, setDiplomaFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  
  // YENİ: Şifreyi göster/gizle durumunu tutan hafıza
  const [showPassword, setShowPassword] = useState(false);

  const roleNames: Record<string, string> = {
    owner: "Evcil Hayvan Sahibi",
    vet: "Veteriner Hekim",
    walker: "Hayvan Bakıcısı",
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    let uploadedDiplomaUrl = "";

    try {
      if (role === "vet" && diplomaFile) {
        const fileFormData = new FormData();
        fileFormData.append("file", diplomaFile);

        const uploadResponse = await fetch("http://localhost:8000/upload", {
          method: "POST",
          body: fileFormData,
        });

        if (!uploadResponse.ok) {
          setErrorMsg("Diploma belgesi sunucuya yüklenemedi. Lütfen tekrar deneyin.");
          return;
        }

        const uploadData = await uploadResponse.json();
        uploadedDiplomaUrl = uploadData.url;
      }

      const requestBody = {
        full_name: fullName,
        email: email,
        password: password,
        role: role,
        tc_no: tcNo || "", 
        diploma_url: uploadedDiplomaUrl
      };

      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.detail || "Kayıt olurken bir hata oluştu.");
        return;
      }

      if (role === "vet") {
        alert("Kayıt talebiniz alındı! Diplomanız admin tarafından onaylandıktan sonra giriş yapabileceksiniz.");
      } else {
        alert("Kayıt başarılı! Giriş yapabilirsiniz.");
      }
      
      router.push(`/login?role=${role}`);
      
    } catch (error) {
      setErrorMsg("Sunucuya bağlanılamadı. Lütfen arka planın (Python) çalıştığından emin olun.");
    }
  };

  return (
    <div 
      className="flex min-h-[91vh] flex-row items-center justify-start p-6 bg-cover bg-center bg-no-repeat relative pl-10 md:pl-20"
      style={{ backgroundImage: `url(${formBgUrl})` }}
    >
      <div className="absolute inset-0 bg-black/40 pointer-events-none z-0"></div>

      <div className="w-full max-w-md bg-white/90 p-8 rounded-3xl shadow-2xl border border-slate-100 relative z-10 backdrop-blur-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900">Aramıza Katılın 🚀</h1>
          <p className="text-sm text-slate-600 mt-1">
            <span className="font-bold text-blue-600">{roleNames[role]}</span> olarak hesap oluşturuyorsunuz.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-xl">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Adınız Soyadınız</label>
            <input 
              type="text" 
              required 
              placeholder="Batuhan Demirel" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900 bg-white" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">E-posta Adresiniz</label>
            <input 
              type="email" 
              required 
              placeholder="batu@mail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900 bg-white" 
            />
          </div>

          {role === "vet" && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">T.C. Kimlik Numarası</label>
                <input 
                  type="text" 
                  required 
                  maxLength={11} 
                  minLength={11} 
                  placeholder="11 haneli T.C. No" 
                  value={tcNo}
                  onChange={(e) => setTcNo(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900 bg-white" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Veterinerlik Diploması (Dosya)</label>
                <input 
                  type="file" 
                  required 
                  accept="image/*,.pdf" 
                  onChange={(e) => setDiplomaFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer border border-slate-200 rounded-xl p-2 bg-white" 
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Şifre Belirleyin</label>
            {/* YENİ: Şifre kutusunu sarmalayan relative div ve göz ikonu */}
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                minLength={8}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Şifreniz en az 8 karakter uzunluğunda olmalı; en az bir büyük harf, bir küçük harf ve bir rakam içermelidir."
                placeholder="En az 8 karakter, 1 büyük harf ve 1 rakam" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-12 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900 bg-white" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 cursor-pointer transition-colors"
                title={showPassword ? "Şifreyi Gizle" : "Şifreyi Göster"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button type="submit" className="mt-2 w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-md text-sm cursor-pointer">
            {role === "vet" ? "Onay Talebi Gönder" : "Hesap Oluştur"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 mt-5 font-medium">
          Zaten hesabınız var mı? <Link href={`/login?role=${role}`} className="text-blue-600 font-bold hover:underline">Giriş Yapın</Link>
        </p>
      </div>
    </div>
  );
}