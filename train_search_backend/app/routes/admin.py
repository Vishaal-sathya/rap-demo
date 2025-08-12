from flask import Blueprint, jsonify
from app.utils.routes_generator import generate_test_routes

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")

@admin_bp.route("/generate-routes-data", methods=["POST"])
def generate_data():
    generate_test_routes()
    return jsonify({"message": "Test data generated"}), 201
