import random
from datetime import datetime, timedelta
from app.extensions import mongo
from app.config import Config


def generate_test_routes(train_count=None):
    """
    Generate random train routes and insert into MongoDB 'routes' collection.
    Each train has a departure date at its first station.
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
    except Exception as e:
        print("Warning: Could not clear routes collection:", e)

    for i in range(train_count):
        # Randomly pick number of stops (min 3, max len(stations_list))
        num_stops = random.randint(3, len(stations_list))
        selected_stations = random.sample(stations_list, num_stops)

        # Choose a random start date within next 30 days
        start_date = datetime.today() + timedelta(days=random.randint(0, 30))

        # Generate departure times and distances
        stops = []
        current_time = datetime.strptime("06:00", "%H:%M")  # All trains start at 6:00 AM
        current_date = start_date

        for idx, (code, name) in enumerate(selected_stations):
            if idx == 0:
                distance = 0
            else:
                distance = random.randint(100, 300)  # km between stops
                travel_minutes = random.randint(90, 300)
                current_time += timedelta(minutes=travel_minutes)

                # If we pass midnight → next day
                if current_time.hour < stops[-1]["departure_hour"]:
                    current_date += timedelta(days=1)

            stops.append({
                "station_code": code,
                "station_name": name,
                "distance_from_prev": distance,
                "departure_time": current_time.strftime("%H:%M"),
                "departure_hour": current_time.hour,  # for midnight check
                "departure_date": current_date.strftime("%Y-%m-%d")
            })

        # Remove helper key used for midnight detection
        for s in stops:
            s.pop("departure_hour", None)

        train_doc = {
            "train_id": f"T{i+1:04d}",        # e.g., T0001
            "train_name": f"Train {i+1}",     # e.g., Train 1
            "stops": stops
        }

        mongo.db.routes.insert_one(train_doc)

    print(f"{train_count} routes inserted successfully!")
