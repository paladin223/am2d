FROM python:3.11.6-alpine3.18

WORKDIR /app

COPY requirements/ /app/requirements

EXPOSE 8000:8000

RUN python -m venv /opt/venv

ENV PATH="/opt/venv/bin:$PATH"

RUN python -m pip install --upgrade pip

RUN pip install -r /app/requirements/prod.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
