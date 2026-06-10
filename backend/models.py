from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Float
from sqlalchemy.orm import relationship
from database import Base

# 1. KULLANICI TABLOSU (Sahip, Bakıcı, Veteriner ve Admin burada tutulacak)
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String) # Şifreleri asla düz metin kaydetmeyiz, şifreleyerek (hash) tutarız
    role = Column(String) # "owner", "vet", "walker", "admin"
    
    # Veterinerlere özel ekstra bilgiler (Diğer rollerde buralar boş kalacak)
    tc_no = Column(String, nullable=True)
    diploma_url = Column(String, nullable=True)
    is_approved = Column(Boolean, default=True)
# 2. YÜRÜYÜŞ İLANLARI TABLOSU
class WalkRequest(Base):
    __tablename__ = "walk_requests"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id")) # İlanı açan sahibin ID'si
    pet_name = Column(String)
    duration = Column(String) # Örn: "2 Saat"
    district = Column(String) # Örn: "bayrampasa"
    address = Column(String)
    price = Column(Float)
    
    # İlanın durumu: "PENDING" (Bekliyor) veya "ACCEPTED" (Kabul Edildi)
    status = Column(String, default="PENDING") 
    walker_id = Column(Integer, ForeignKey("users.id"), nullable=True) # İşi kabul eden bakıcının ID'si

# 3. VETERİNER RANDEVULARI TABLOSU
class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id")) # Randevuyu alan sahibin ID'si
    pet_name = Column(String)
    district = Column(String)
    address = Column(String)
    date_time = Column(String) # Örn: "2026-05-30T14:00"
    reason = Column(String)
    
    # Randevunun durumu: "PENDING" (Bekliyor), "CONFIRMED" (Onaylandı)
    status = Column(String, default="PENDING")
    vet_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Randevuyu onaylayan veterinerin ID'si