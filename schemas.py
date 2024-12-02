from pydantic import BaseModel

import database


class Order(BaseModel):
    name: database.str16
    email: database.str32
    phone: database.str32
    text: database.str512
