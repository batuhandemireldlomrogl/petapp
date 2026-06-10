from fastapi import FastAPI, Depends, HTTPException, status

from fastapi.middleware.cors import CORSMiddleware  # YENİ: CORS eklentisini içeri alıyoruz

from sqlalchemy.orm import Session

from passlib.context import CryptContext



import models

import schemas

from database import engine, SessionLocal
import os
import shutil
from fastapi import UploadFile, File
from fastapi.staticfiles import StaticFiles



models.Base.metadata.create_all(bind=engine)



app = FastAPI(title="PetApp API", description="Evcil Hayvan Platformu Arka Plan Servisi")
app = FastAPI(title="PetApp API", description="Evcil Hayvan Platformu Arka Plan Servisi")

# YENİ: Dosyaların kaydedileceği klasörü oluştur ve dışarıdan erişime aç
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# YENİ: NEXT.JS İÇİN GÜVENLİK İZNİ (CORS AYARLARI)

app.add_middleware(

    CORSMiddleware,

    allow_origins=["http://localhost:3000"],  # Sadece Next.js'in (3000 portu) bağlanmasına izin ver

    allow_credentials=True,

    allow_methods=["*"],  # GET, POST, PUT, DELETE hepsine izin ver

    allow_headers=["*"],

)

# Siber Güvenlik: Şifreleme ayarlarımız (Kodun geri kalanı buradan itibaren aynı şekilde devam edecek...)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ... (Aşağıdaki tüm kodların aynı kalacak)

def get_password_hash(password):

    return pwd_context.hash(password)



# YENİ: Düz şifre ile veritabanındaki şifreli (hash) metni karşılaştıran fonksiyon

def verify_password(plain_password, hashed_password):

    return pwd_context.verify(plain_password, hashed_password)

# Veritabanı bağlantısı açma ve kapatma fonksiyonu

def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()

@app.get("/")

def read_root():

    return {"mesaj": "PetApp Backend Sistemine Hoş Geldiniz! 🚀"}

# KAYIT OLMA (REGISTER) KÖPRÜSÜ

# Eski @app.post("/register") fonksiyonunun İÇİNİ silip yerine bunu yapıştırın:
@app.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Bu e-posta adresi sistemde zaten kayıtlı!")

    hashed_password = get_password_hash(user.password)

    # EĞER ROL VETERİNERSE (vet) ONAY DURUMU FALSE (ONAYSIZ) OLSUN, DEĞİLSE DIREKT TRUE OLSUN
    is_approved_status = False if user.role == "vet" else True

    new_user = models.User(
        full_name=user.full_name,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role,
        tc_no=user.tc_no,
        diploma_url=user.diploma_url,
        is_approved=is_approved_status  # Yeni eklediğimiz sütuna durumu yazıyoruz
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"mesaj": "Kullanıcı başarıyla oluşturuldu!", "kullanici_id": new_user.id}



# YENİ: GİRİŞ YAPMA (LOGIN) KÖPRÜSÜ

@app.post("/login")
def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="E-posta adresi veya şifre hatalı!")

    # YENİ GÜVENLİK KONTROLÜ: Kullanıcı veterinerse ve henüz onaylanmamışsa (False ise) içeri alma!
    if db_user.role == "vet" and db_user.is_approved == False:
        raise HTTPException(status_code=403, detail="Hesabınız henüz admin tarafından onaylanmamıştır!")

    return {
        "mesaj": "Giriş başarılı!", 
        "kullanici_id": db_user.id,
        "isim": db_user.full_name,
        "role": db_user.role
    }

# YENİ: YÜRÜYÜŞ İLANI OLUŞTURMA KÖPRÜSÜ

@app.post("/walk-requests", status_code=status.HTTP_201_CREATED)

def create_walk_request(request: schemas.WalkRequestCreate, db: Session = Depends(get_db)):

    # 1. Gelen veriyi veritabanı modelimize uygun hale getir

    new_request = models.WalkRequest(

        owner_id=request.owner_id,

        pet_name=request.pet_name,

        duration=request.duration,

        district=request.district,

        address=request.address,

        price=request.price

        # status (durum) otomatik olarak "PENDING" (Bekliyor) atanacak, çünkü models.py'de öyle ayarladık

    )

   

    # 2. Veritabanına kaydet

    db.add(new_request)

    db.commit()

    db.refresh(new_request)

   

    # 3. Başarı mesajı döndür

    return {

        "mesaj": "Yürüyüş ilanı başarıyla oluşturuldu! 🐶",

        "ilan_id": new_request.id,

        "durum": new_request.status

    }

# YENİ: TÜM YÜRÜYÜŞ İLANLARINI LİSTELEME KÖPRÜSÜ

@app.get("/walk-requests")

def get_all_walk_requests(db: Session = Depends(get_db)):

    # Veritabanındaki tüm ilanları getir

    requests = db.query(models.WalkRequest).all()

    return requests

# YENİ: RANDEVU OLUŞTURMA KÖPRÜSÜ

@app.post("/appointments", status_code=status.HTTP_201_CREATED)

def create_appointment(appointment: schemas.AppointmentCreate, db: Session = Depends(get_db)):

    new_appointment = models.Appointment(

        owner_id=appointment.owner_id,

        pet_name=appointment.pet_name,

        district=appointment.district,

        address=appointment.address,

        date_time=appointment.date_time,

        reason=appointment.reason

    )

   

    db.add(new_appointment)

    db.commit()

    db.refresh(new_appointment)

   

    return {

        "mesaj": "Randevu başarıyla oluşturuldu! 🩺",

        "randevu_id": new_appointment.id,

        "durum": new_appointment.status

    }



# YENİ: TÜM RANDEVULARI LİSTELEME KÖPRÜSÜ

@app.get("/appointments")

def get_all_appointments(db: Session = Depends(get_db)):

    appointments = db.query(models.Appointment).all()

    return appointments
# main.py dosyasının EN ALTINA yapıştırın:
@app.get("/admin/pending-vets")
def get_pending_vets(db: Session = Depends(get_db)):
    # Sadece rolü 'vet' olan ve henüz onaylanmamış (False) kullanıcıları filtrele
    vets = db.query(models.User).filter(models.User.role == "vet", models.User.is_approved == False).all()
    return vets

@app.put("/admin/approve-vet/{vet_id}")
def approve_vet(vet_id: int, db: Session = Depends(get_db)):
    vet = db.query(models.User).filter(models.User.id == vet_id).first()
    if not vet:
        raise HTTPException(status_code=404, detail="Veteriner bulunamadı")

    # Veterinerin onay durumunu True (Onaylı) yap ve veritabanını güncelle
    vet.is_approved = True
    db.commit()
    return {"mesaj": "Veteriner başarıyla onaylandı!"}
# YENİ: KULLANICI PROFİL BİLGİLERİNİ GETİRME KÖPRÜSÜ
@app.get("/users/{user_id}")
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    
    return {
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
        "tc_no": user.tc_no
    }
# YENİ: KULLANICI PROFİL BİLGİLERİNİ GETİRME KÖPRÜSÜ
@app.get("/users/{user_id}")
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    
    return {
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
        "tc_no": user.tc_no
    }
# YENİ: KULLANICI BİLGİLERİNİ VE ŞİFRESİNİ GÜNCELLEME KÖPRÜSÜ
from pydantic import BaseModel
from typing import Optional

# Ön yüzden gelecek güncelleme verilerinin şablonu
class UserUpdateInput(BaseModel):
    full_name: str
    email: str
    password: Optional[str] = None  # Şifre isteğe bağlı (boşsa güncellenmeyecek)

@app.put("/users/{user_id}")
def update_user_profile(user_id: int, data: UserUpdateInput, db: Session = Depends(get_db)):
    # 1. Veritabanında kullanıcıyı bul
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    
    # 2. E-posta değiştiyse, yeni e-postanın başkasında olup olmadığını kontrol et
    if data.email != user.email:
        existing_user = db.query(models.User).filter(models.User.email == data.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor!")
    
    # 3. İsim ve E-posta bilgilerini güncelle
    user.full_name = data.full_name
    user.email = data.email
    
    # 4. Eğer yeni bir şifre yazıldıysa, onu hashle (kriptola) ve öyle kaydet
    if data.password and data.password.strip() != "":
        user.hashed_password = get_password_hash(data.password)
    
    # 5. Değişiklikleri veritabanına işle
    db.commit()
    db.refresh(user)
    
    return {"mesaj": "Profil bilgileriniz başarıyla güncellendi!", "isim": user.full_name}
# YENİ: DOSYA YÜKLEME KÖPRÜSÜ
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Dosyayı uploads klasörüne kaydet
    file_location = f"uploads/{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
    
    # Veritabanına yazılacak olan URL yolunu döndür
    return {"url": f"/uploads/{file.filename}"}
# YENİ: VETERİNER REDDETME (SİLME) KÖPRÜSÜ
@app.delete("/admin/reject-vet/{vet_id}")
def reject_vet(vet_id: int, db: Session = Depends(get_db)):
    # 1. Önce veterineri bul
    vet = db.query(models.User).filter(models.User.id == vet_id).first()
    if not vet:
        raise HTTPException(status_code=404, detail="Veteriner bulunamadı")
    
    # 2. Veritabanından tamamen sil ve kaydet
    db.delete(vet)
    db.commit()
    
    return {"mesaj": "Kayıt reddedildi ve sistemden silindi."}