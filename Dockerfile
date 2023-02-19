FROM python:3.10.9-buster
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
RUN apt-get update && apt-get install
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && apt-get install -y nodejs
RUN apt-get install nodejs
COPY requirements.txt requirements.txt
COPY pytube-master pytube-master
RUN pip3 install -r requirements.txt
COPY front/frontreact/package.json /code/front/frontreact/package.json
COPY front/frontreact/package-lock.json /code/front/frontreact/package-lock.json
WORKDIR /code/front/frontreact
RUN npm install
COPY . /code/
RUN npm run build
WORKDIR /code
ENTRYPOINT ["bash","-c" ,"python manage.py collectstatic --noinput && daphne -b 0.0.0.0 -p 8000 stopify_drive.asgi:application"]
