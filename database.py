from typing import Annotated

from sqlalchemy import create_engine
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import sessionmaker

from config import settings

sync_engine = create_engine(
    url=settings.DATABASE_URL_psycopg,
    echo=True,
    # pool_size=5,
    # max_overflow=10,
)

session_factory = sessionmaker(sync_engine)


str512 = Annotated[str, 512]
str32 = Annotated[str, 32]
str16 = Annotated[str, 16]
intpk = Annotated[int, mapped_column(primary_key=True)]


class Base(DeclarativeBase):
    type_annotation_map = {str512: String(512), str32: String(32),
                           str16: String(16), intpk: Integer}
