"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react"; // YENİ: Hata mesajlarını tutmak için ekledik

// Arka plan görseli aynı kalıyor
const formBgUrl = "https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") || "owner";

  // YENİ: Hata mesajını ekranda göstermek için hafıza
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(""); // Her denemede önceki hatayı temizle

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    // Admin girişi (Proje jürisi veya testler için burası sabit kalabilir)
    if (email === "admin@petapp.com" && password === "admin123") {
      localStorage.setItem("userRole", "admin");
      router.push("/admin");
      return;
    }

    try {
      // YENİ: Python arka planına (mutfağa) giriş bilgilerini gönderiyoruz
      const response = await fetch("https://petapp-fj1j.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // Eğer giriş başarısızsa (yanlış şifre veya e-posta yoksa)
      if (!response.ok) {
        setErrorMsg(data.detail || "Giriş yapılamadı. Bilgilerinizi kontrol edin.");
        return;
      }

      // Her şey doğruysa, arka plandan gelen GERÇEK verileri tarayıcıya kaydet
      localStorage.setItem("userId", data.kullanici_id);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userName", data.isim);

      // Başarılı giriş mesajı ve kullanıcının kendi paneline yönlendirme
      alert(`Tekrar hoş geldin, ${data.isim}!`);
      router.push(`/${data.role}`);
      
    } catch (error) {
      setErrorMsg("Sunucuya bağlanılamadı. Arka planın (Python) çalıştığından emin olun.");
    }
  };

  return (
    <div 
      className="flex min-h-[91vh] flex-row items-center justify-start p-6 bg-cover bg-center bg-no-repeat relative pl-10 md:pl-20"
      style={{ backgroundImage: `url(${formBgUrl})` }}
    >
      <div className="absolute inset-0 bg-black/40 pointer-events-none z-0"></div>

      {/* Giriş Formu Kartı */}
      <div className="w-full max-w-md bg-white/90 p-8 rounded-3xl shadow-2xl border border-slate-100 relative z-10 backdrop-blur-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Hoş Geldiniz 👋</h1>
          <p className="text-sm text-slate-600 mt-1.5">Devam etmek için hesabınıza giriş yapın.</p>
        </div>

        {/* YENİ: Hata durumunda çıkacak uyarı kutusu */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-xl text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-slate-800 mb-1">E-posta Adresiniz</label>
            <input id="email" name="email" type="email" required placeholder="batu@mail.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900 bg-white" />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-slate-800 mb-1">Şifreniz</label>
            <input id="password" name="password" type="password" required placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900 bg-white" />
          </div>

          <button type="submit" className="mt-4 w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-md text-sm cursor-pointer">
            Giriş Yap
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6 font-medium">
          Hesabınız yok mu? <Link href={`/register?role=${defaultRole}`} className="text-blue-600 font-bold hover:underline">Kayıt Olun</Link>
        </p>
      </div>
    </div>
  );
}