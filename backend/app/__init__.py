from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.Config")

    db.init_app(app)
    jwt.init_app(app)
    CORS(app)  # allow the react dev server to hit the api

    # importing blueprints here to avoid circular imports
    from .auth import auth_bp
    from .notes import notes_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(notes_bp, url_prefix="/api/notes")

    # create tables on first run if they don't exist yet
    with app.app_context():
        db.create_all()

    return app
