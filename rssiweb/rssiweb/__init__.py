from flask import Flask
from whitenoise import WhiteNoise
import os
import logging
from rssiweb import config

logging.basicConfig(level=logging.INFO)
BASE_DIR = os.path.dirname(__file__)
TEMPLATE_PATH = os.path.join(BASE_DIR, "templates")


def create_app(test_config=None):
    app = Flask(__name__)
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(SECRET_KEY=os.environ.get("SECRET_KEY", "dev"))

    app.config.from_object(config.Base)
    logging.info(app.config)

    if test_config is None:
        app.config.from_object(config.Base)
    else:
        app.config.from_mapping(test_config)

    autorefresh = app.config.get("AUTO_REFRESH", False)
    app.wsgi_app = WhiteNoise(app.wsgi_app, autorefresh=autorefresh)
    my_static_folders = (
        (f"{TEMPLATE_PATH}/css", "css"),
        (f"{TEMPLATE_PATH}/js", "js"),
        (f"{TEMPLATE_PATH}/images", "images"),
        (f"{TEMPLATE_PATH}/images/logo", ""),
    )
    for folder, prefix in my_static_folders:
        app.wsgi_app.add_files(folder, prefix)

    from . import views

    app.register_blueprint(views.app)
    return app
