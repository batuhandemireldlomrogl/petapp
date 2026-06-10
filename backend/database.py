from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite veritabanı dosyamızın adı (Projeyi çalıştırdığımızda otomatik olarak oluşacak)
SQLALCHEMY_DATABASE_URL = "postgresql://neondb_owner:npg_pcnx5I2fKiYS@ep-icy-surf-aqgfb9j5.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Veritabanı motorunu (engine) oluşturuyoruz
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Veritabanı ile aramızdaki iletişimi (oturumu) yönetecek yapı
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Tablolarımızı (Kullanıcılar, Randevular vb.) oluştururken miras alacağımız temel sınıf
Base = declarative_base()