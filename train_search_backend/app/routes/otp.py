from datetime import datetime
from flask import Blueprint, request, jsonify, render_template
from app.extensions import mongo, mail
from flask_mail import Message
import random
import string
from datetime import timedelta

otp_bp = Blueprint("otp", __name__, url_prefix="/otp")

@otp_bp.route("/generate", methods=["POST"])
def generate_otp():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    # Generate 6-digit OTP
    otp = ''.join(random.choices(string.digits, k=6))
    expiry_minutes = 5
    expiry_time = datetime.now(datetime.timezone.utc) + timedelta(minutes=expiry_minutes)

    # Store OTP in MongoDB
    mongo.db.otp_codes.insert_one({
        "email": email,
        "otp": otp,
        "expires_at": expiry_time
    })

    # Prepare HTML email using Jinja template
    msg = Message(subject="Your Train Booking OTP", recipients=[email])
    msg.html = render_template(
        "otp_email.html",
        otp=otp,
        expiry_minutes=expiry_minutes,
        current_year=datetime.utcnow().year
    )

    # Send email
    try:
        mail.send(msg)
    except Exception as e:
        return jsonify({"error": f"Failed to send OTP: {str(e)}"}), 500

    return jsonify({"message": "OTP sent successfully"}), 200


@otp_bp.route("/verify", methods=["POST"])
def verify_otp():
    data = request.get_json()
    email = data.get("email")
    otp = data.get("otp")

    if not email or not otp:
        return jsonify({"error": "Email and OTP are required"}), 400

    # Find OTP record
    record = mongo.db.otp_codes.find_one({"email": email, "otp": otp})
    if not record:
        return jsonify({"error": "Invalid OTP"}), 400

    # Check expiry
    if datetime.utcnow() > record["expires_at"]:
        return jsonify({"error": "OTP has expired"}), 400

    # OTP is valid — delete it so it can’t be reused
    mongo.db.otp_codes.delete_one({"_id": record["_id"]})

    return jsonify({"message": "OTP verified successfully"}), 200
