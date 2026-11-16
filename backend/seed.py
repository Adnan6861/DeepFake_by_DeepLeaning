from database import engine, SessionLocal, Base
from models import User, AnalysisRecord, ContactMessage

def init_db():
    print("Creating PostgreSQL tables if they don't exist...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

    db = SessionLocal()
    try:
        # Initial users matching project specification
        initial_users = [
            {
                "id": "user_adnan",
                "name": "Muhammad Adnan",
                "email": "adnannawazk080@gmail.com",
                "role": "Student",
                "institution": "Media Forensics & AI Research Center",
                "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                "password_hash": "numl1234",
            },
            {
                "id": "user_hadia",
                "name": "Hadia Noor",
                "email": "hadia.noor@forensics.ai",
                "role": "Student",
                "institution": "Media Forensics & AI Research Center",
                "avatar_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
                "password_hash": "numl1234",
            },
            {
                "id": "user_kainat",
                "name": "Syeda Kainat Zahra",
                "email": "kainat.zahra@forensics.ai",
                "role": "Supervisor",
                "institution": "Department of Software Engineering, Media Forensics Lab",
                "avatar_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
                "password_hash": "numl1234",
            },
        ]

        for u_data in initial_users:
            existing = db.query(User).filter(User.email == u_data["email"]).first()
            if not existing:
                new_user = User(**u_data)
                db.add(new_user)
                print(f"Seeded user: {u_data['name']} ({u_data['email']})")

        db.commit()
        print("Database initialization and seeding completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
