import random
from datetime import datetime, timedelta
from app.extensions import mongo
from app.config import Config

def generate_test_routes(train_count=None):
    """
    Generate random train routes and insert into MongoDB 'routes' collection.
    """
    if train_count is None:
        train_count = Config.TEST_DATA_TRAIN_COUNT

    # Example station pool (station_code, station_name)
    stations_list = [
        ("MAS", "Chennai Central"),
        ("VLR", "Vellore"),
        ("SBC", "Bangalore City"),
        ("MYS", "Mysuru"),
        ("MAQ", "Mangalore"),
        ("SHM", "Shimoga"),
        ("HYB", "Hyderabad"),
        ("PNQ", "Pune"),
        ("BPL", "Bhopal"),
        ("NDLS", "New Delhi")
    ]

    # Clear existing data
    try:
        mongo.db.routes.delete_many({})
    except:
        pass

    for i in range(train_count):
        # Randomly pick number of stops (min 3, max len(stations_list))
        num_stops = random.randint(3, len(stations_list))
        selected_stations = random.sample(stations_list, num_stops)

        # Generate departure times and distances
        stops = []
        current_time = datetime.strptime("06:00", "%H:%M")
        for idx, (code, name) in enumerate(selected_stations):
            if idx == 0:
                distance = 0
            else:
                distance = random.randint(100, 300)  # km between stops
                current_time += timedelta(minutes=random.randint(90, 300))

            stops.append({
                "station_code": code,
                "station_name": name,
                "distance_from_prev": distance,
                "departure_time": current_time.strftime("%H:%M")
            })

        train_doc = {
            "train_id": f"T{i+1:04d}",        # e.g., T0001, T0002, ..., T1000
            "train_name": f"Train {i+1}",     # e.g., Train 1, Train 2
            "stops": stops
        }

        mongo.db.routes.insert_one(train_doc)

    print(f"{train_count} routes inserted successfully!")


generate_test_routes(10)
