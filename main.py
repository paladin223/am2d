from fastapi import FastAPI
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.templating import Jinja2Templates

app = FastAPI()

templates = Jinja2Templates(directory="pages")


@app.get("/", response_class=JSONResponse)
async def read_root(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "title": "Добро пожаловать в FastAPI",
            "message": "Это приложение использует шаблоны Jinja2",
        },
    )
