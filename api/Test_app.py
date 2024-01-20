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
    engine_load = 5.0
    absolute_load = 5.0
    throttle_pos = 10.0
    fuel_level = 89.9
    while True:
        # to replace with real data
        speed_kmh = random.uniform(0, 130) 
        rpm = random.uniform(0, 5500)
        engine_load = generate_value(engine_load)
        absolute_load = generate_value(absolute_load)
        throttle_pos = generate_value(throttle_pos)
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

start_server = websockets.serve(send_speed, "0.0.0.0", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
