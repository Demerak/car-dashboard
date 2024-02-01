import asyncio
import websockets
import random
import json

# temp function to generate random values for testing
def generate_value(current_val):
  random_incr = random.uniform(-0.5, 0.5)
  new_val = current_val + random_incr
  return max(0.0, min(new_val, 100))

async def send_speed(websocket, path):
  speed = 50
  engine_load = 5.0
  absolute_load = 5.0
  throttle_pos = 10.0
  fuel_level = 89.9
  coolant_temp = 60.0
  intake_temp = 20.0
  ambient_temp = 0.0
  while True:
    # to replace with real data
    speed_kmh = generate_value(speed)
    rpm = random.uniform(0, 5500)
    engine_load = generate_value(engine_load)
    absolute_load = generate_value(absolute_load)
    throttle_pos = generate_value(throttle_pos)
    engine_run_time = random.uniform(0, 1000)
    coolant_temp = generate_value(coolant_temp)
    intake_temp = generate_value(intake_temp)
    ambient_temp = generate_value(ambient_temp)
    data = {
      'speed': speed_kmh,
      'rpm': rpm,
      'engineLoad': engine_load,
      'absoluteLoad': absolute_load,
      'throttlePos': throttle_pos,
      'fuelLevel': fuel_level,
      'engineRunTime': engine_run_time,
      'coolantTemp': coolant_temp,
      'intakeTemp': intake_temp,
      'ambientTemp': ambient_temp,
      }
    await websocket.send(json.dumps(data))
    await asyncio.sleep(0.5) 

start_server = websockets.serve(send_speed, "0.0.0.0", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
