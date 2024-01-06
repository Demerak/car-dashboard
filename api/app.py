from flask import Flask
from flask_socketio import SocketIO, send, emit
import logging
import random
import time
import os

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

if os.environ.get("FLASK_ENV") == "production":
  origins = [
    "http://localhost:3000/",
    "http://localhost:8080/"
  ]
  debug_mode = False
else:
  origins = "*"
  debug_mode = True

print(origins)

socketio = SocketIO(app, cors_allowed_origins=origins)

print("Server started")

@socketio.on('speed')
def handle_speed(s):
  while True:
    r=random.randint(1,100)
    logging.debug(f"Speed: {r}")
    print(f"Speed: {r}")

    send(r)
    emit('speed', r, broadcast=True)

socketio.init_app(app)

@app.route("/")
def home():
    return "Hello, Flask!"

if __name__ == '__main__':
  socketio.run(app, debug=debug_mode)