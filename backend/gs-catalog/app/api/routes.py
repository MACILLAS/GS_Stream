from flask import Blueprint, jsonify, send_file, request
import os

api_blueprint = Blueprint('api', __name__,)

# Temporary code to serve splat models
splat_models = [
    {"id": "101", "name": "st_comb/st_1", "file": "st_1.splat"},
    {"id": "102", "name": "st_comb/st_2", "file": "st_2.splat"},
    {"id": "103", "name": "RCH", "file": "rch.splat"}
]

@api_blueprint.route('/models/splat/list', methods=['GET'])
def get_splat_models_list():
    return jsonify(splat_models)


@api_blueprint.route('/models/splat/<splat_model_id>', methods=['GET'])
def get_splat_model_data(splat_model_id):
    SPLAT_MODELS_DIRECTORY = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
        'model_files'
    ) + os.sep    
    model_file = next((model["file"] for model in splat_models if model["id"] == splat_model_id), None)
    if model_file is None:
        return "Model not found", 404
    
    file_path = SPLAT_MODELS_DIRECTORY + model_file
    
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    else:
        return "File not found", 404
