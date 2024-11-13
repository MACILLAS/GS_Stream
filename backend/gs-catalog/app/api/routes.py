from .health import health_blueprint
from .models import models_blueprint
from .assets import assets_blueprint
from .annotations import annotations_blueprint

def configure_routes(app):
    app.register_blueprint(health_blueprint, url_prefix="/health")
    app.register_blueprint(models_blueprint, url_prefix="/api")
    app.register_blueprint(assets_blueprint, url_prefix="/api")
    app.register_blueprint(annotations_blueprint, url_prefix="/api")
