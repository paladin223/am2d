from sqlalchemy.orm import Mapped

import database


class Order(database.Base):
    __tablename__ = "orders"

    id: Mapped[database.intpk]
    name: Mapped[database.str512]
    email: Mapped[database.str512]
    phone: Mapped[database.str512]
    text: Mapped[database.str512]
