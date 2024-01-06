import asyncio
import websockets
import random
import json

async def send_speed(websocket, path):
    while True:
        # to replace with real data
        speed_kmh = random.uniform(0, 130) 
        rpm = random.uniform(0, 5500)
        data = {
            'speed': speed_kmh,
            'rpm': rpm }
        await websocket.send(json.dumps(data))
        await asyncio.sleep(0.5) 

start_server = websockets.serve(send_speed, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
