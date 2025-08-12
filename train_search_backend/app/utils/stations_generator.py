from app.extensions import mongo
from app.config import Config

def generate_station_data():
    stations_list = [
        {"station_code": "NDLS", "station_name": "New Delhi"},
        {"station_code": "MMCT", "station_name": "Mumbai Central"},
        {"station_code": "CDG", "station_name": "Chandigarh"},
        {"station_code": "SDAH", "station_name": "Sealdah"},
        {"station_code": "SHC", "station_name": "Saharsa"},
        {"station_code": "JP", "station_name": "Jaipur"},
        {"station_code": "MAS", "station_name": "Chennai Central"},
        {"station_code": "SBC", "station_name": "Bangalore City"},
        {"station_code": "HYB", "station_name": "Hyderabad"},
        {"station_code": "PUNE", "station_name": "Pune"},
        {"station_code": "ADI", "station_name": "Ahmedabad"},
        {"station_code": "KOAA", "station_name": "Kolkata"}
    ]

    # Clear old stations before inserting
    mongo.db.stations.delete_many({})
    mongo.db.stations.insert_many(stations_list)

    print(f"{len(stations_list)} stations inserted successfully!")
