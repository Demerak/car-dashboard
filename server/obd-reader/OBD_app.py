# This is the script that will read from the OBD2 port and send the data to the web app

import asyncio
import websockets
import json
import obd
from obd import OBDStatus
from datetime import datetime

async def handle_connection(websocket):
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
    engine_run_time = connection.query(obd.commands.RUN_TIME)
    coolant_temp = connection.query(obd.commands.COOLANT_TEMP)
    intake_temp = connection.query(obd.commands.INTAKE_TEMP)
    ambient_temp = connection.query(obd.commands.AMBIANT_AIR_TEMP)
    
    data = {
      'speed': speed_kmh,
      'rpm': rpm,
      'engineLoad': engine_load,
      'absoluteLoad': absolute_load,
      'throttlePos': throttle_pos,
      'fuelLevel': fuel_level,
      'engineRunTime': engine_run_time,
      'coolantTemp': round(coolant_temp,1),
      'intakeTemp': round(intake_temp,1),
      'ambientTemp': round(ambient_temp,1),
      'timestamp': datetime.now().isoformat()
      }
    await websocket.send(json.dumps(data))
    await asyncio.sleep(0.5) 

async def main():
  async with websockets.serve(handle_connection, "0.0.0.0", 8765):
    await asyncio.Future()  # run forever

if __name__ == "__main__":
  asyncio.run(main())
