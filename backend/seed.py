from database import engine, SessionLocal, Base
from models import User, AnalysisRecord, ContactMessage

LEGACY_DEMO_USER_IDS = ["user_adnan", "user_hadia", "user_kainat"]


def init_db():
    print("Creating PostgreSQL tables if they don't exist...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

    db = SessionLocal()
    try:
        db.query(AnalysisRecord).filter(
            AnalysisRecord.user_id.in_(LEGACY_DEMO_USER_IDS)
        ).update({AnalysisRecord.user_id: None}, synchronize_session=False)
        removed_count = db.query(User).filter(
            User.id.in_(LEGACY_DEMO_USER_IDS)
        ).delete(synchronize_session=False)

        db.commit()
        print(f"Removed {removed_count} legacy demo accounts; database initialization completed.")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
