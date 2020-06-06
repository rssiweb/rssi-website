from flask import Flask, render_template, request
from whitenoise import WhiteNoise
import hashlib
import click
import os

app = Flask(__name__)
app.wsgi_app = WhiteNoise(app.wsgi_app)
my_static_folders = (
    ('templates/css', 'css'),
    ('templates/js', 'js'),
    ('templates/images', 'images')
)
for folder, prefix in my_static_folders:
    app.wsgi_app.add_files(folder, prefix)

@app.route('/<string:name>')
@app.route('/')
def public_pages(name='index'):
    return render_template(name + '.html' if '.' not in name else name)

@app.route('/secure/<string:name>')
def secure_pages(name):
    code = request.form.get('code')
    if code:
        salt = os.getenv('SALT')
        content = (salt + code).encode()
        hashed_code = hashlib.sha512(content).hexdigest()
        if hashed_code == os.getenv('CODE'):
            if '.' not in name:
                name = 'secure/' + name + '.html' 
        else:
            name = 'secure/unauthorized.html'
    else:
        name = 'secure/unauthorized.html'
    return render_template(name)


@app.cli.command("generate-hash-for")
@click.argument("code")
def set_code(code):
    salt = os.getenv('SALT')
    content = (salt + code).encode()
    hashed_code = hashlib.sha512(content).hexdigest()
    print(hashed_code)
