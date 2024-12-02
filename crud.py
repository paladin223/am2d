# from sqlalchemy import select

from database import Base
from database import sync_engine
from database import session_factory

import models
import schemas


def create_tables():
    Base.metadata.create_all(sync_engine, checkfirst=True)


def drop_tables():
    Base.metadata.drop_all(sync_engine)


def add_order(order: schemas.Order):
    with session_factory() as session:
        new_order = models.Order(**order.model_dump())
        session.add(new_order)
        session.commit()
        session.refresh(new_order)
    return new_order
