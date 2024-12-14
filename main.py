import random

from fastapi import FastAPI
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import httpx

import crud
import schemas

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="pages")
projects = ["eli", "shibui", "skuratov", "village"]

projects_name = {
    "eli": "Лесные бани",
    "shibui": "Ресторан Shibui",
    "skuratov": 'Кофейня "Skuratov"',
    "village": 'Проект загародного комплекса "Батон"',
}

# crud.drop_tables()
# crud.create_tables()


@app.get("/", response_class=JSONResponse)
async def read_root(request: Request):
    header_photo = [f"/static/img/header/{i}.webp" for i in range(1, 9)]
    left_images = []
    right_images = []

    for name in projects:
        left_images.append(
            [f"/static/img/section/{name}_left.webp", projects_name[name]]
        )
        right_images.append(
            [f"/static/img/section/{name}_right.webp", projects_name[name]]
        )

    return templates.TemplateResponse(
        "index.html",
        {
            "title": "am2d",
            "request": request,
            "header_photo": header_photo,
            "left_images": left_images,
            "right_images": right_images,
        },
    )


@app.get("/prices", response_class=JSONResponse)
async def prices(request: Request):
    nav_photo = random.choice(projects)
    return templates.TemplateResponse(
        "prices.html",
        {
            "nav_photo": nav_photo,
            "request": request,
            "title": "am2d",
        },
    )


@app.get("/about", response_class=JSONResponse)
async def about(request: Request):
    nav_photo = random.choice(projects)
    return templates.TemplateResponse(
        "about.html",
        {
            "nav_photo": nav_photo,
            "request": request,
            "title": "am2d",
        },
    )


@app.get("/contacts", response_class=JSONResponse)
async def contacts(request: Request):
    nav_photo = random.choice(projects)
    return templates.TemplateResponse(
        "contacts.html",
        {
            "nav_photo": nav_photo,
            "request": request,
            "title": "am2d",
        },
    )


@app.post("/submit", response_model=schemas.Order)
async def submit(order: schemas.Order):
    url = "http://bot:8001/new"
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=order.dict())
        if response.status_code == 200:
            print(f"200 in /submit {order}")
        else:
            print(f"500 in /submit {order}")
    return crud.add_order(order)
