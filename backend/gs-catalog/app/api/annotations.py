from flask import Blueprint, jsonify, request, g, current_app
from datetime import datetime, timezone
from pymongo import MongoClient
from bson.objectid import ObjectId

annotations_blueprint = Blueprint(
    "annotations_api",
    __name__
)

def get_annotations_collection():
    client = getattr(current_app, 'mongo_client', None)
    if client is None:
        client = MongoClient('mongodb://localhost:27017/')
        current_app.mongo_client = client
    # Use test database in testing environment
    if current_app.config['TESTING']:
        db = client['annotations_test_db']
    else:
        db = client['annotations_db']
    return db['annotations']

@annotations_blueprint.before_request
def before_request():
    g.annotations_collection = get_annotations_collection()

# List all annotations
@annotations_blueprint.route('/annotations', methods=['GET'])
def list_annotations():
    annotations = list(g.annotations_collection.find({}, {'_id': 1, 'id': 1, 'position': 1, 'metadata': 1, 'created_at': 1, 'updated_at': 1}))
    for annotation in annotations:
        annotation['_id'] = str(annotation['_id'])  # Convert ObjectId to string for JSON compatibility
    return jsonify(annotations)

# Get a specific annotation by custom `id`
@annotations_blueprint.route('/annotations/<int:annotation_id>', methods=['GET'])
def get_annotation(annotation_id):
    annotation = g.annotations_collection.find_one({'id': annotation_id}, {'_id': 1, 'id': 1, 'position': 1, 'metadata': 1, 'created_at': 1, 'updated_at': 1})
    if annotation:
        annotation['_id'] = str(annotation['_id'])  # Convert ObjectId to string for JSON compatibility
        return jsonify(annotation)
    else:
        return jsonify({'error': 'Annotation not found'}), 404

# Update an annotation by custom `id`
@annotations_blueprint.route('/annotations/<int:annotation_id>', methods=['PUT'])
def update_annotation(annotation_id):
    data = request.get_json()
    result = g.annotations_collection.update_one(
        {'id': annotation_id},
        {'$set': {
            'position': data.get('position'),
            'metadata': data.get('metadata'),
            'updated_at': datetime.now(timezone.utc).isoformat()
        }}
    )
    if result.matched_count:
        annotation = g.annotations_collection.find_one({'id': annotation_id}, {'_id': 1, 'id': 1, 'position': 1, 'metadata': 1, 'created_at': 1, 'updated_at': 1})
        annotation['_id'] = str(annotation['_id'])
        return jsonify(annotation)
    else:
        return jsonify({'error': 'Annotation not found'}), 404

# Create an annotation with auto-generated `id`
@annotations_blueprint.route('/annotations', methods=['POST'])
def create_annotation():
    data = request.get_json()
    
    # Find the highest `id` in the current collection and add 1 for the new `id`
    last_annotation = g.annotations_collection.find_one(sort=[("id", -1)])
    next_id = (last_annotation["id"] + 1) if last_annotation else 1

    annotation = {
        'id': next_id,  # Auto-generated `id` field
        'position': data.get('position'),
        'metadata': data.get('metadata'),
        'created_at': datetime.now(timezone.utc).isoformat(),
        'updated_at': datetime.now(timezone.utc).isoformat(),
    }
    
    # Insert the annotation with both `_id` (auto-generated) and custom `id`
    result = g.annotations_collection.insert_one(annotation)
    annotation['_id'] = str(result.inserted_id)  # Convert `_id` to string for JSON compatibility
    return jsonify(annotation), 201


# Delete an annotation by custom `id`
@annotations_blueprint.route('/annotations/<int:annotation_id>', methods=['DELETE'])
def delete_annotation(annotation_id):
    result = g.annotations_collection.delete_one({'id': annotation_id})
    if result.deleted_count:
        return jsonify({'message': 'Annotation deleted'})
    else:
        return jsonify({'error': 'Annotation not found'}), 404
