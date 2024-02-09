from pymongo import MongoClient

def connect_to_database():
  CONNECTION_STRING = "mongodb://host.docker.internal:27017/vehicle_data"
  client = MongoClient(CONNECTION_STRING)
  return client['vehicle_data'] # database name

dbname = connect_to_database()
print(dbname)
collection = dbname["vehicle_data_test"]

for item in collection.find():
  print(item)