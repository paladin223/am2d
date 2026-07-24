from typing import Annotated
import time
import logging

from sqlalchemy import create_engine
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import text
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError

from config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_engine_with_retry(max_retries=5, retry_delay=2):
    """Create database engine with connection retry logic"""
    for attempt in range(max_retries):
        try:
            engine = create_engine(
                url=settings.DATABASE_URL_psycopg,
                echo=True,
                # pool_size=5,
                # max_overflow=10,
            )
            # Test the connection
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            logger.info("Successfully connected to database")
            return engine
        except OperationalError as e:
            if attempt < max_retries - 1:
                logger.warning(f"Database connection attempt {attempt + 1} failed: {e}")
                logger.info(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                logger.error(f"Failed to connect to database after {max_retries} attempts")
                raise e

sync_engine = create_engine_with_retry()
session_factory = sessionmaker(sync_engine)


str512 = Annotated[str, 512]
# str32 = Annotated[str, 32]
# str16 = Annotated[str, 16]
intpk = Annotated[int, mapped_column(primary_key=True)]


class Base(DeclarativeBase):
    type_annotation_map = {
        str512: String(512),
        intpk: Integer,
    }


def init_db():
    """Initialize database tables"""
    try:
        logger.info("Creating database tables...")
        Base.metadata.create_all(sync_engine, checkfirst=True)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Failed to create database tables: {e}")
        raise e
