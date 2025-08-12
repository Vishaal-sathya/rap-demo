from flask import Blueprint, request, jsonify
from app.extensions import mongo
from app.config import Config
from datetime import datetime

trains_bp = Blueprint("trains", __name__, url_prefix="/trains")

@trains_bp.route("/search", methods=["GET"])
def search_trains():
    source = request.args.get("source")
    destination = request.args.get("destination")
    travel_date_str = request.args.get("date")  # Expected format: YYYY-MM-DD
    sort_by = request.args.get("sort_by")  # 'price' or 'time'
    print(sort_by)
    if not source or not destination or not travel_date_str:
        return jsonify({"error": "source, destination, and date are required"}), 400

    try:
        travel_date = datetime.strptime(travel_date_str, "%Y-%m-%d")
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    trains = mongo.db.routes.find({})
    results = []

    for train in trains:
        stops = train.get("stops", [])
        source_index = next((i for i, stop in enumerate(stops) if stop["station_name"] == source), None)
        dest_index = next((i for i, stop in enumerate(stops) if stop["station_name"] == destination), None)

        if source_index is not None and dest_index is not None and dest_index > source_index:
            # Calculate distance & price
            distance = sum(stop["distance_from_prev"] for stop in stops[source_index+1:dest_index+1])
            price = round(distance * Config.PRICE_PER_KM, 2)

            # Get times
            dep_time_str = stops[source_index]["departure_time"]
            arr_time_str = stops[dest_index]["departure_time"]

            # Convert to datetime
            dep_datetime = datetime.combine(travel_date, datetime.strptime(dep_time_str, "%H:%M").time())
            arr_datetime = datetime.combine(travel_date, datetime.strptime(arr_time_str, "%H:%M").time())

            # If arrival time is earlier than departure time → next day
            if arr_datetime <= dep_datetime:
                arr_datetime += timedelta(days=1)
            
            duration_minutes = int((arr_datetime - dep_datetime).total_seconds() // 60)
            

            results.append({
                "train_id": train["train_id"],
                "train_name": train.get("train_name", ""),
                "departure_date": dep_datetime.strftime("%Y-%m-%d"),
                "departure_time": dep_time_str,
                "arrival_date": arr_datetime.strftime("%Y-%m-%d"),
                "arrival_time": arr_time_str,
                "distance_km": distance,
                "duration": duration_minutes,
                "price": price 
            })

    # Sorting
    if sort_by == "price_low":
        results.sort(key=lambda x: x["price"])
    elif sort_by == "price_high":
        results.sort(key=lambda x: x["price"], reverse=True)
    elif sort_by == "duration_low":
        results.sort(key=lambda x: x["duration"])
    elif sort_by == "duration_high":
        results.sort(key=lambda x: x["duration"], reverse=True)
    else:
        # fallback sort by departure_time ascending
        results.sort(key=lambda x: datetime.strptime(x["departure_time"], "%H:%M"))

    return jsonify({"results": results}), 200




from datetime import datetime, timedelta
from flask import request, jsonify
from app.extensions import mongo
from app.config import Config

@trains_bp.route("/combined-route", methods=["GET"])
def combined_route():
    source = request.args.get("source")
    destination = request.args.get("destination")
    travel_date_str = request.args.get("date")  # Expected YYYY-MM-DD

    if not source or not destination or not travel_date_str:
        return jsonify({"error": "source, destination, and date are required"}), 400

    try:
        travel_date = datetime.strptime(travel_date_str, "%Y-%m-%d")
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    routes = list(mongo.db.routes.find({}))
    suggestions = []

    for first_train in routes:
        stops1 = first_train.get("stops", [])
        src_idx = next((i for i, s in enumerate(stops1) if s["station_code"] == source), None)

        if src_idx is None:
            continue

        # Try each possible connection station after source
        for connect_idx in range(src_idx + 1, len(stops1)):
            connect_station = stops1[connect_idx]["station_code"]
            connect_arrival_time_str = stops1[connect_idx]["departure_time"]

            # Second-leg trains from connect_station to destination
            for second_train in routes:
                if second_train["train_id"] == first_train["train_id"]:
                    continue

                stops2 = second_train.get("stops", [])
                conn_src_idx = next((i for i, s in enumerate(stops2) if s["station_code"] == connect_station), None)
                dest_idx = next((i for i, s in enumerate(stops2) if s["station_code"] == destination), None)

                if conn_src_idx is None or dest_idx is None or dest_idx <= conn_src_idx:
                    continue

                # --- Calculate first leg datetime ---
                first_dep_time_str = stops1[src_idx]["departure_time"]
                first_arr_time_str = stops1[connect_idx]["departure_time"]

                first_dep_dt = datetime.combine(travel_date, datetime.strptime(first_dep_time_str, "%H:%M").time())
                first_arr_dt = datetime.combine(travel_date, datetime.strptime(first_arr_time_str, "%H:%M").time())
                if first_arr_dt <= first_dep_dt:
                    first_arr_dt += timedelta(days=1)  # Overnight arrival

                # --- Calculate second leg datetime ---
                second_dep_time_str = stops2[conn_src_idx]["departure_time"]
                second_arr_time_str = stops2[dest_idx]["departure_time"]

                second_dep_dt = datetime.combine(first_arr_dt.date(), datetime.strptime(second_dep_time_str, "%H:%M").time())
                if second_dep_dt <= first_arr_dt:
                    second_dep_dt += timedelta(days=1)  # Leaves next day

                second_arr_dt = datetime.combine(second_dep_dt.date(), datetime.strptime(second_arr_time_str, "%H:%M").time())
                if second_arr_dt <= second_dep_dt:
                    second_arr_dt += timedelta(days=1)  # Overnight arrival

                # --- Calculate distances and prices ---
                dist1 = sum(stop["distance_from_prev"] for stop in stops1[src_idx+1:connect_idx+1])
                price1 = round(dist1 * Config.PRICE_PER_KM, 2)

                dist2 = sum(stop["distance_from_prev"] for stop in stops2[conn_src_idx+1:dest_idx+1])
                price2 = round(dist2 * Config.PRICE_PER_KM, 2)

                suggestions.append({
                    "legs": [
                        {
                            "train_id": first_train["train_id"],
                            "train_name": first_train.get("train_name", ""),
                            "from": source,
                            "to": connect_station,
                            "departure_date": first_dep_dt.strftime("%Y-%m-%d"),
                            "departure_time": first_dep_time_str,
                            "arrival_date": first_arr_dt.strftime("%Y-%m-%d"),
                            "arrival_time": first_arr_time_str,
                            "distance_km": dist1,
                            "price": price1
                        },
                        {
                            "train_id": second_train["train_id"],
                            "train_name": second_train.get("train_name", ""),
                            "from": connect_station,
                            "to": destination,
                            "departure_date": second_dep_dt.strftime("%Y-%m-%d"),
                            "departure_time": second_dep_time_str,
                            "arrival_date": second_arr_dt.strftime("%Y-%m-%d"),
                            "arrival_time": second_arr_time_str,
                            "distance_km": dist2,
                            "price": price2
                        }
                    ],
                    "total_distance_km": dist1 + dist2,
                    "total_price": round(price1 + price2, 2)
                })

    return jsonify({"suggestions": suggestions}), 200



@trains_bp.route("/<train_id>", methods=["GET"])
def get_train_details(train_id):
    """
    Get full schedule for a specific train.
    """
    train = mongo.db.routes.find_one({"train_id": train_id}, {"_id": 0})
    
    if not train:
        return jsonify({"error": "Train not found"}), 404

    return jsonify(train), 200