import pandas as pd
import os
from sqlalchemy import create_engine
from glob import glob
from dotenv import load_dotenv

# 1. Load DB Connection
# We load from the parent folder's .env file
load_dotenv(dotenv_path="../.env")
db_url = os.getenv("DATABASE_URL")

# FIX: SQLAlchemy requires 'postgresql://', but Neon gives 'postgres://'
if db_url and db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

print("Connecting to Database...")
engine = create_engine(db_url)

# 2. Configuration
DATA_DIR = "raw_data"

def clean_and_upload(file_pattern, table_name, column_mapping=None):
    files = glob(os.path.join(DATA_DIR, file_pattern))
    print(f"\nProcessing {len(files)} files for table: '{table_name}'...")
    
    for file in files:
        try:
            # Read CSV
            df = pd.read_csv(file)
            
            # Standardize Columns: Lowercase and strip spaces
            df.columns = [c.strip().lower() for c in df.columns]
            
            # Rename columns if strictly needed (Map CSV header -> Prisma Field)
            # Example: If CSV has 'age 0-5', rename to 'age_0_5'
            # Based on your dataset description, they mostly match already.
            
            # Data Cleaning: Fix District Names
            if 'district' in df.columns:
                df['district'] = df['district'].astype(str).str.upper().str.strip()
                df['district'] = df['district'].replace({
                    'AHMADABAD': 'AHMEDABAD',
                    'BANGALORE': 'BENGALURU',
                    'CALCUTTA': 'KOLKATA',
                    'GURGAON': 'GURUGRAM'
                })
                
            # Data Cleaning: Pincode to String
            if 'pincode' in df.columns:
                 df['pincode'] = pd.to_numeric(df['pincode'], errors='coerce').fillna(0).astype(int).astype(str)

            # Upload to Neon (Chunked for speed)
            # 'Enrolment' matches the Prisma Model name (Case Sensitive usually!)
            df.to_sql(table_name, engine, if_exists='append', index=False, method='multi', chunksize=1000)
            print(f" -> Uploaded: {os.path.basename(file)}")
            
        except Exception as e:
            print(f" [!] Error uploading {file}: {e}")

# 3. Execution Logic
if __name__ == "__main__":
    
    # Upload Enrolment Files -> 'Enrolment' Table
    clean_and_upload("*enrolment*.csv", "Enrolment")
    
    # Upload Demographic Files -> 'Demographic' Table
    clean_and_upload("*demographic*.csv", "Demographic")
    
    # Upload Biometric Files -> 'Biometric' Table
    clean_and_upload("*biometric*.csv", "Biometric")

    print("\n-------------------------------------------")
    print("SUCCESS: Data Ingestion Complete.")
    print("-------------------------------------------")