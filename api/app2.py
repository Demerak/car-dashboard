import asyncio
import websockets
import random

async def send_speed(websocket, path):
    while True:
        speed_kmh = random.uniform(0, 130)  # Replace this with your speed calculation logic
        await websocket.send(str(speed_kmh))
        await asyncio.sleep(0.5)  # Update speed every second

start_server = websockets.serve(send_speed, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
