from flask import Blueprint, jsonify
from app.utils.routes_generator import generate_test_routes
from app.utils.stations_generator import generate_station_data

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")

@admin_bp.route("/generate-routes-data", methods=["POST"])
def generate_data():
    generate_test_routes(10)
    return jsonify({"message": "Test data generated"}), 201

@admin_bp.route("/generate-stations", methods=["POST"])
def generate_stations():
    generate_station_data()
    return jsonify({"message": "Stations generated successfully"}), 201