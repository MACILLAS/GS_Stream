from flask import Flask
from flask_cors import CORS

from .api.health import health_blueprint
from .api.routes import api_blueprint

def configure_routes(app):
    app.register_blueprint(health_blueprint, url_prefix='/health')
    app.register_blueprint(api_blueprint, url_prefix='/api')
    
def create_app():
  app = Flask(__name__)
  CORS(app)
  
  configure_routes(app)

  return app
