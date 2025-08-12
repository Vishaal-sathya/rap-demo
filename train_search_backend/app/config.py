import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

class Config:
    # Flask settings
    SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
    FLASK_ENV = os.getenv("FLASK_ENV", "production")
    FLASK_DEBUG = os.getenv("FLASK_DEBUG", "0")
    FLASK_RUN_PORT = int(os.getenv("FLASK_RUN_PORT", 5000))

    # MongoDB settings
    MONGO_URI = os.getenv("MONGO_URI")
    MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")

    # Application constants
    PRICE_PER_KM = float(os.getenv("PRICE_PER_KM", 1.25))
    TEST_DATA_TRAIN_COUNT = int(os.getenv("TEST_DATA_TRAIN_COUNT", 1000))
