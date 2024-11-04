from flask import Blueprint, jsonify, send_file, request
import os

assets_blueprint = Blueprint(
    "assets_api", 
    __name__,
)

# Temporary code to serve splat assets
splat_assets = [
    {"id": "101", "name": "st_comb/st_1", "file": "st_1.splat"},
    {"id": "102", "name": "st_comb/st_2", "file": "st_2.splat"},
    {"id": "103", "name": "RCH", "file": "rch.splat"},
]


@assets_blueprint.route("/assets/splat/list", methods=["GET"])
def get_splat_assets_list():
    return jsonify(splat_assets)


@assets_blueprint.route("/assets/splat/<splat_asset_id>", methods=["GET"])
def get_splat_asset_data(splat_asset_id):
    SPLAT_ASSETS_DIRECTORY = (
        os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "asset_files"
        )
        + os.sep
    )
    asset_file = next(
        (asset["file"] for asset in splat_assets if asset["id"] == splat_asset_id), None
    )
    if asset_file is None:
        return "Asset not found", 404

    file_path = SPLAT_ASSETS_DIRECTORY + asset_file

    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    else:
        return "File not found", 404
