import websocket
import json
from pymongo import MongoClient

def connect_to_database():
  """Connect to the MongoDB database."""
  CONNECTION_STRING = "mongodb://host.docker.internal:27017/vehicle_data"
  client = MongoClient(CONNECTION_STRING)
  return client['vehicle_data']  # database name

def on_message(ws, message, collection):
  """Handle incoming messages and insert them into the specified collection."""
  collection.insert_one(json.loads(message))

def on_error(ws, error):
  """Handle WebSocket errors."""
  print(error)

def on_close(ws):
  """Handle WebSocket closure."""
  print("WebSocket connection closed.")

def on_open(ws):
  """Handle WebSocket opening."""
  print("WebSocket connection opened.")

if __name__ == "__main__":
  db = connect_to_database()
  print("Connected to database:", db)

  collection = db["vehicle_data_test"]  # collection name (same as database name in this case)

  ws = websocket.WebSocketApp("ws://localhost:8765",
    on_open=on_open,
    on_message=lambda ws, message: on_message(ws, message, collection),
    on_error=on_error,
    on_close=on_close)
  
  ws.run_forever()
