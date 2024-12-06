from fastapi import FastAPI
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

import crud
import schemas

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="pages")


# crud.drop_tables()
# crud.create_tables()


@app.get("/", response_class=JSONResponse)
async def read_root(request: Request):
    left_images = [
        "/static/img/section2_left.jpg",
        "/static/img/bordo80/footer_left.jpg",
    ]
    right_images = [
        "/static/img/section2_right.jpg",
        "/static/img/bordo80/footer_middle.jpg",
    ]
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "title": "am2d",
            "left_images": left_images,
            "right_images": right_images,
        },
    )


@app.get("/prices", response_class=JSONResponse)
async def prices(request: Request):
    return templates.TemplateResponse(
        "prices.html",
        {
            "request": request,
            "title": "am2d",
        },
    )


@app.get("/about", response_class=JSONResponse)
async def about(request: Request):
    return templates.TemplateResponse(
        "about.html",
        {
            "request": request,
            "title": "am2d",
        },
    )


@app.get("/contacts", response_class=JSONResponse)
async def contacts(request: Request):
    return templates.TemplateResponse(
        "contacts.html",
        {
            "request": request,
            "title": "am2d",
        },
    )


@app.post("/submit", response_model=schemas.Order)
async def submit(order: schemas.Order):
    return crud.add_order(order)
