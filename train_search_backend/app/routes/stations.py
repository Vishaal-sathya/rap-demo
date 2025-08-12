from flask import Blueprint, request, jsonify
from app.extensions import mongo
from app.config import Config
from datetime import datetime

stations_bp = Blueprint("stations", __name__, url_prefix="/stations")

@stations_bp.route("", methods=["GET"])
def get_stations():
    """
    Fetch all stations from MongoDB for dropdown.
    """
    stations = list(mongo.db.stations.find({}, {"_id": 0}))
    return jsonify({"stations": stations}), 200

