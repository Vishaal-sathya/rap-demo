from flask import Blueprint, request, jsonify
from app.extensions import mongo
from app.config import Config
from datetime import datetime

trains_bp = Blueprint("trains", __name__, url_prefix="/trains")

@trains_bp.route("/search", methods=["GET"])
def search_trains():
    source = request.args.get("source")
    destination = request.args.get("destination")
    sort_by = request.args.get("sort_by")  # 'price' or 'time'

    if not source or not destination:
        return jsonify({"error": "source and destination are required"}), 400

    trains = mongo.db.routes.find({})
    results = []

    for train in trains:
        stops = train.get("stops", [])
        source_index = next((i for i, stop in enumerate(stops) if stop["station_code"] == source), None)
        dest_index = next((i for i, stop in enumerate(stops) if stop["station_code"] == destination), None)

        if source_index is not None and dest_index is not None and dest_index > source_index:
            # Calculate distance
            distance = sum(stop["distance_from_prev"] for stop in stops[source_index+1:dest_index+1])
            price = round(distance * Config.PRICE_PER_KM, 2)

            departure_time = stops[source_index]["departure_time"]
            arrival_time = stops[dest_index]["departure_time"]

            results.append({
                "train_id": train["train_id"],
                "train_name": train.get("train_name", ""),
                "departure_time": departure_time,
                "arrival_time": arrival_time,
                "distance_km": distance,
                "price": price
            })

    # Sorting
    if sort_by == "price":
        results.sort(key=lambda x: x["price"])
    elif sort_by == "time":
        # Sort by departure time (HH:MM)
        results.sort(key=lambda x: datetime.strptime(x["departure_time"], "%H:%M"))

    return jsonify({"results": results}), 200




@trains_bp.route("/combined-route", methods=["GET"])
def combined_route():
    source = request.args.get("source")
    destination = request.args.get("destination")

    if not source or not destination:
        return jsonify({"error": "source and destination are required"}), 400

    routes = list(mongo.db.routes.find({}))

    suggestions = []

    # Loop over all first-leg trains
    for first_train in routes:
        stops1 = first_train.get("stops", [])
        src_idx = next((i for i, s in enumerate(stops1) if s["station_code"] == source), None)

        if src_idx is None:
            continue

        # Try every station after the source as a potential connection
        for connect_idx in range(src_idx + 1, len(stops1)):
            connect_station = stops1[connect_idx]["station_code"]
            connect_arrival_time = stops1[connect_idx]["departure_time"]

            # Second-leg trains from connect_station to destination
            for second_train in routes:
                if second_train["train_id"] == first_train["train_id"]:
                    continue

                stops2 = second_train.get("stops", [])
                conn_src_idx = next((i for i, s in enumerate(stops2) if s["station_code"] == connect_station), None)
                dest_idx = next((i for i, s in enumerate(stops2) if s["station_code"] == destination), None)

                if conn_src_idx is None or dest_idx is None or dest_idx <= conn_src_idx:
                    continue

                # Ensure connection timing works
                fmt = "%H:%M"
                arr_time_dt = datetime.strptime(connect_arrival_time, fmt)
                dep_time_dt = datetime.strptime(stops2[conn_src_idx]["departure_time"], fmt)
                if dep_time_dt <= arr_time_dt:
                    continue  # No enough time to connect

                # Calculate distances and prices
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
                            "departure_time": stops1[src_idx]["departure_time"],
                            "arrival_time": stops1[connect_idx]["departure_time"],
                            "distance_km": dist1,
                            "price": price1
                        },
                        {
                            "train_id": second_train["train_id"],
                            "train_name": second_train.get("train_name", ""),
                            "from": connect_station,
                            "to": destination,
                            "departure_time": stops2[conn_src_idx]["departure_time"],
                            "arrival_time": stops2[dest_idx]["departure_time"],
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