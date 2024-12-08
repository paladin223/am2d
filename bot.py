import asyncio
import logging
from os import getenv
import sys

from aiogram import Bot
from aiogram import Dispatcher
from aiogram import html
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import Command
from aiogram.filters import CommandStart
from aiogram.types import Message
from fastapi import FastAPI
from fastapi import HTTPException

import crud
import schemas

# Bot token can be obtained via https://t.me/BotFather
TOKEN = getenv("TELEGRAM_BOT_TOKEN")

# All handlers should be attached to the Router (or Dispatcher)ё

app2 = FastAPI()

dp = Dispatcher()

bot = Bot(token=TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))


@dp.message(CommandStart())
async def command_start_handler(message: Message) -> None:
    """
    This handler receives messages with `/start` command
    """
    await message.answer(f"Hello, {html.bold(message.from_user.full_name)}!")


@dp.message(Command("orders"))
async def get_orders_command(message: Message):
    orders = [
        schemas.Order.model_validate(order) for order in crud.get_orders()
    ]
    print(orders)
    message_text = f"{orders}"
    await message.answer(message_text)


@app2.post("/new", response_model=str)
async def new_order(order: schemas.Order):
    try:
        await bot.send_message(
            chat_id=336485664, text=str(schemas.Order.model_validate(order))
        )
        await bot.send_message(
            chat_id=974824380, text=str(schemas.Order.model_validate(order))
        )
        return {"status": "success", "message": "Message sent"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def main() -> None:
    await dp.start_polling(bot)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())
