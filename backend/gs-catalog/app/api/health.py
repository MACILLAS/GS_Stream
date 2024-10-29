from flask import Blueprint, jsonify

health_blueprint = Blueprint('/', __name__,)

@health_blueprint.route('/', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})
