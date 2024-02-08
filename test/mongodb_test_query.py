from pymongo import MongoClient

def connect_to_database():
  CONNECTION_STRING = "mongodb://host.docker.internal:27017/vehicle_data"
  client = MongoClient(CONNECTION_STRING)
  return client['vehicle_data'] # database name

dbname = connect_to_database()
print(dbname)
collection_name = dbname["vehicle_data_test"]

item_details = collection_name.find()
for item in item_details:
  print(item)