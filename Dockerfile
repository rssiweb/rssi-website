FROM python:3.8-slim

COPY Pipfile /app/Pipfile
COPY Pipfile.lock /app/Pipfile.lock
ADD ./rssiweb /app/rssiweb

WORKDIR /app

RUN pip install --upgrade pip pipenv
RUN pipenv install --system --deploy 

EXPOSE 80

ENTRYPOINT ["gunicorn", "rssiweb:create_app()", "-b", "0.0.0.0:80"]
