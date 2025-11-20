FROM python:3.12-slim

WORKDIR /app

COPY ./ ./

RUN pip install -r dependencies.txt

CMD ["python", "src/main.py"]
