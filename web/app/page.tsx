import Link from "next/link";

// Ana sayfa için sanal arka plan resmi 
const homeBgUrl = "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

export default function Home() {
  return (
    <main 
      className="flex min-h-screen flex-col items-center justify-center p-6 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${homeBgUrl})` }}
    >
      {/* ÇÖZÜM BURADA: pointer-events-none ekledik ki bu siyah katman tıklamaları engellemesin (Hayalet katman oldu) */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none z-0"></div>

      {/* Ana İçerik (z-10 ile siyah katmanın üstüne alıyoruz) */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        
        {/* Arka plan resimli olduğu için yazıları beyaza (text-white) çevirdik ve gölge (drop-shadow) ekledik */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg text-center">
          Evcil Hayvan Platformu
        </h1>
        <p className="text-lg text-slate-200 mb-10 text-center max-w-md drop-shadow-md">
          Randevu alın, bakıcı bulun veya hizmet verin. Lütfen giriş yapmak istediğiniz rolü seçin:
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-3xl justify-center">
          
          {/* Butonlara backdrop-blur (arkayı buzlu cam yapma) ve hover:scale-105 (üzerine gelince büyüme) efekti ekledik */}
          <Link href="/login?role=owner" className="flex-1 px-6 py-4 bg-white/95 text-blue-600 border-2 border-transparent rounded-xl font-bold text-lg hover:bg-white hover:scale-105 transition-all shadow-xl text-center backdrop-blur-sm cursor-pointer">
            🐶 Evcil Hayvan Sahibi
          </Link>

          <Link href="/login?role=vet" className="flex-1 px-6 py-4 bg-white/95 text-emerald-600 border-2 border-transparent rounded-xl font-bold text-lg hover:bg-white hover:scale-105 transition-all shadow-xl text-center backdrop-blur-sm cursor-pointer">
            🩺 Veteriner
          </Link>

          <Link href="/login?role=walker" className="flex-1 px-6 py-4 bg-white/95 text-purple-600 border-2 border-transparent rounded-xl font-bold text-lg hover:bg-white hover:scale-105 transition-all shadow-xl text-center backdrop-blur-sm cursor-pointer">
            🦮 Hayvan Bakıcısı
          </Link>

        </div>
      </div>
    </main>
  );
}