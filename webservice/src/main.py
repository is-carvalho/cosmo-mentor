import os
import logging
from flask import Flask
from flask_cors import CORS
from flask import jsonify
#from api.utils.database import db
from api.utils.responses import response_with
import api.utils.responses as resp
from api.routes.suggestions import suggestion_routes





app = Flask(__name__)

app.url_map.strict_slashes = False

CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"},}, supports_credentials=True)

"""if os.environ.get('WORK_ENV') == 'PROD':
    app_config = ProductionConfig
elif os.environ.get('WORK_ENV') == 'TEST':
    app_config = TestingConfig
else:
    app_config = DevelopmentConfig


app.config.from_object(app_config)"""

# START GLOBAL HTTP CONFIGURATIONS
app.register_blueprint(suggestion_routes, url_prefix='/api/suggestions')

@app.after_request
def add_header(response):
    return response

@app.errorhandler(400)
def bad_request(e):
    logging.error(e)
    return response_with(resp.BAD_REQUEST_400)

@app.errorhandler(500)
def server_error(e):
    logging.error(e)
    return response_with(resp.SERVER_ERROR_500)

@app.errorhandler(404)
def not_found(e):
    logging.error(e)
    return response_with(resp. SERVER_ERROR_404)

if __name__ == '__main__':
    app.run(port=5000, host="0.0.0.0", use_reloader=False)