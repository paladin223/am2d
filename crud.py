# from sqlalchemy import select

from database import Base
from database import sync_engine
import models
import schemas


def create_tables():
    Base.metadata.create_all(sync_engine, checkfirst=True)


def drop_tables():
    Base.metadata.drop_all(sync_engine)
