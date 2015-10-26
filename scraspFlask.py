# -*- coding: utf-8 -*-

from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash, send_from_directory


"""
    import pip install Flask
"""


# initialization
app = Flask(__name__)
app.config.update(
    DEBUG=True,
)


# controllers
@app.route("/hello")
def hello():
    return "Hello from Python!"


@app.route('/')
def index(name=None):
    return render_template('index.html', name=name)


# launch app
if __name__ == "__main__":
    # run on default 5000 port on localhost
    app.run()