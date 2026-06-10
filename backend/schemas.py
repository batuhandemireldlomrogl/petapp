from pydantic import BaseModel
from typing import Optional

# Next.js'ten Kayıt Ol formundan gelecek verilerin şablonu
class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str
    role: str
    tc_no: Optional[str] = None
    diploma_url: Optional[str] = None
    # Next.js'ten Giriş Yap formundan gelecek verilerin şablonu
class UserLogin(BaseModel):
    email: str
    password: str
    # Next.js'ten Yürüyüş İlanı oluşturulurken gelecek verilerin şablonu
class WalkRequestCreate(BaseModel):
    owner_id: int  # İlanı kimin açtığını bilmemiz için ID'si
    pet_name: str
    duration: str  # Örn: "1 Saat", "2 Saat"
    district: str  # Örn: "Kadıköy", "Beşiktaş"
    address: str
    price: float   # Örn: 250.0
    # Next.js'ten Randevu oluşturulurken gelecek verilerin şablonu
class AppointmentCreate(BaseModel):
    owner_id: int
    pet_name: str
    district: str
    address: str
    date_time: str # Örn: "2026-06-15T14:30"
    reason: str    # Örn: "Genel Muayene ve Aşı"