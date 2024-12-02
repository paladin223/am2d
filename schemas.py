from pydantic import BaseModel

import database


class SongBase(BaseModel):
    id: int
    name: database.str16
    phone: database.str32
    text: database.str512
