FROM python:3.10-slim

COPY ./app/Pipfile /app/Pipfile
COPY ./app/Pipfile.lock /app/Pipfile.lock

WORKDIR /app

RUN pip install --upgrade pip pipenv
RUN pipenv install --system --deploy 

ADD ./app /app

EXPOSE 80

ENTRYPOINT ["gunicorn", "app:app", "-b", "0.0.0.0:80"]
