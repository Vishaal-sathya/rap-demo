from flask import Flask
from app.config import Config
from app.extensions import mongo
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)

    # Initialize MongoDB
    mongo.init_app(app)

    # Import and register blueprints
    from app.routes.stations import stations_bp
    app.register_blueprint(stations_bp)

    from app.routes.trains import trains_bp
    app.register_blueprint(trains_bp)

    from app.routes.admin import admin_bp
    app.register_blueprint(admin_bp)

    from app.routes.otp import otp_bp
    app.register_blueprint(otp_bp)

    return app
