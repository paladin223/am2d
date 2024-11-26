from fastapi import FastAPI
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="pages")


@app.get("/", response_class=JSONResponse)
async def read_root(request: Request):
    left_images = [
        "/static/img/section2_left.jpg",
        "/static/img/bordo80/footer_left.jpg"
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
            "right_images": right_images
        },
    )


@app.get("/prices", response_class=JSONResponse)
async def prices(request: Request):
    left_images = [
        "/static/img/section2_left.jpg",
        "/static/img/bordo80/footer_left.jpg"
    ]
    right_images = [
        "/static/img/section2_right.jpg",
        "/static/img/bordo80/footer_middle.jpg",
    ]
    return templates.TemplateResponse(
        "prices.html",
        {
            "request": request,
            "title": "am2d",
        },
    )
