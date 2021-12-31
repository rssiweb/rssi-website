#!/usr/bin/env python

from distutils.core import setup
import os

def package_files(directory):
    paths = []
    for (path, directories, filenames) in os.walk(directory):
        for filename in filenames:
            paths.append(os.path.join('..', path, filename))
    return paths

extra_files = package_files('rssiweb/templates')

setup(
    name="rssiweb",
    packages=["rssiweb"],
    author='Zeeshan Khan',
    author_email='zkhan1093@gmail.com',
    include_package_data=True,
    package_data={
      'rssiweb': extra_files,
   },
    install_requires=["flask", "gunicorn", "whitenoise"],
)
