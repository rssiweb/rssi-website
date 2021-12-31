from flask import Flask, render_template, request
from whitenoise import WhiteNoise
import hashlib
import os

autorefresh = os.getenv("AUTO_REFRESH") == "True"
app = Flask(__name__)
app.wsgi_app = WhiteNoise(app.wsgi_app, autorefresh=autorefresh)
my_static_folders = (
    ("templates/css", "css"),
    ("templates/js", "js"),
    ("templates/images", "images"),
    ("templates/images/logo", ""),
)
for folder, prefix in my_static_folders:
    app.wsgi_app.add_files(folder, prefix)


def is_authorized(folder):
    """
    given a folder it checks the username and password from 2
    environment variables
    - <FOLDER>_USER to contain the username for this folder
    - <USER>_CODE to contain the hashed code for the user
    """
    user = request.form.get("user")
    user_for_folder = os.getenv(f"{folder.upper()}_USER", None)
    if not user_for_folder or not user or user != user_for_folder:
        return False
    else:
        code = request.form.get("code")
        if not code:
            return False
        salt = os.getenv("SALT")
        content = (salt + code).encode()
        hashed_code = hashlib.sha512(content).hexdigest()
        return hashed_code == os.getenv(f"{user.upper()}_CODE")


@app.route("/<string:name>")
@app.route("/")
def public_pages(name="index"):
    return render_template(name + ".html" if "." not in name else name)


@app.route("/<string:folder>/<string:name>", methods=["GET", "POST"])
def secure_pages(folder, name):
    if not is_authorized(folder):
        name = f"{folder}/unauthorized.html"
    else:
        if "." not in name:
            name = f"{folder}/{name}.html"
    return render_template(name)


@app.route("/generate-hash-for/<string:code>", methods=["GET"])
def set_code(code):
    salt = os.getenv("SALT")
    if not salt:
        return "SALT not set"
    content = (salt + code).encode()
    hashed_code = hashlib.sha512(content).hexdigest()
    return str(hashed_code)
