# This is the script that will read from the OBD2 port and send the data to the web app

import asyncio
import websockets
import json
import obd
from obd import OBDStatus

async def send_data(websocket, path):
  connection = obd.OBD()
  if connection.status() == OBDStatus.CAR_CONNECTED:
    print("Car Connected")

  while True:
    speed_kmh = connection.query(obd.commands.SPEED) 
    rpm = connection.query(obd.commands.RPM) 
    engine_load = connection.query(obd.commands.ENGINE_LOAD) 
    absolute_load = connection.query(obd.commands.ABSOLUTE_LOAD) 
    throttle_pos = connection.query(obd.commands.THROTTLE_POS) 
    fuel_level = connection.query(obd.commands.FUEL_LEVEL)
    data = {
      'speed': speed_kmh,
      'rpm': rpm,
      'engineLoad': engine_load,
      'absoluteLoad': absolute_load,
      'throttlePos': throttle_pos,
      'fuelLevel': fuel_level

        }
    await websocket.send(json.dumps(data))
    await asyncio.sleep(0.5) 

start_server = websockets.serve(send_data, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
