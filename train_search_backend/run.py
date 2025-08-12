from app import create_app

app = create_app()

if __name__ == "__main__":
    # Debug mode and port are read from config
    app.run(
        host="0.0.0.0", 
        port=app.config.get("FLASK_RUN_PORT", 5000), 
        debug=app.config.get("FLASK_DEBUG", False)
    )
