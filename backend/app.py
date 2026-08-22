import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config
from database import db

# Import models to ensure they are registered with SQLAlchemy
import models.user
import models.employee
import models.attendance
import models.leave
import models.payroll
import models.notification
import models.document

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    CORS(app)
    db.init_app(app)
    jwt = JWTManager(app)

    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Register blueprints (to be imported later when routes are created)
    # from routes.auth import auth_bp
    # app.register_blueprint(auth_bp, url_prefix='/api/auth')

    @app.route('/')
    def index():
        return jsonify({
            'success': True,
            'message': 'Welcome to Dayflow HRMS API'
        })

    # Global error handlers
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({'success': False, 'message': 'Bad Request'}), 400

    @app.errorhandler(401)
    def unauthorized(e):
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401

    @app.errorhandler(403)
    def forbidden(e):
        return jsonify({'success': False, 'message': 'Forbidden'}), 403

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'success': False, 'message': 'Not Found'}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
