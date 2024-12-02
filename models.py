from sqlalchemy.orm import Mapped

import database


class Orders(database.Base):
    __tablename__ = "orders"

    id: Mapped[database.intpk]
    name: Mapped[database.str16]
    phone: Mapped[database.str32]
    text: Mapped[database.str512]
