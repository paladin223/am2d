from pydantic import BaseModel

import database


class Order(BaseModel):
    name: database.str512
    email: database.str512
    phone: database.str512
    text: database.str512

    class Config:
        from_attributes = True
