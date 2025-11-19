FROM python:3.12-slim

WORKDIR /app/data

COPY data/requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

COPY . /app

ENV PYTHONPATH="/app/data:${PYTHONPATH}"

CMD ["python", "src/main.py"]
