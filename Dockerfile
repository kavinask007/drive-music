FROM python:3.9.16-buster
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /code
RUN apt-get update && apt-get install
COPY . /code/
RUN pip3 install -r requirements.txt
