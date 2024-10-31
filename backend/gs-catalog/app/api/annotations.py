from flask import Blueprint, jsonify, request
from datetime import datetime, timezone

annotations_blueprint = Blueprint(
  "annotations_api",
  __name__
)

# In-memory storage for annotations
annotations = {}
next_id = 1

# Get annotation list
@annotations_blueprint.route('/annotations', methods=['GET'])
def list_annotations():
    # Optional: Add filtering based on query parameters
    return jsonify(list(annotations.values()))

# Get a annotation by id
@annotations_blueprint.route('/annotations/<int:annotation_id>', methods=['GET'])
def get_annotation(annotation_id):
    annotation = annotations.get(annotation_id)
    if annotation:
      return jsonify(annotation)
    else:
      return jsonify({'error': 'Annotation not found'}), 404

# Update existing annotation
@annotations_blueprint.route('/annotations/<int:annotation_id>', methods=['PUT'])
def update_annotation(annotation_id):
  annotation = annotations.get(annotation_id)
  if not annotation:
    return jsonify({'error':'Annotation not found'}), 404
  data = request.get_json()
  annotation['position'] = data.get('position', annotation['position'])
  annotation['metadata'] = data.get('metadata', annotation['metadata'])
  annotation['updated_at'] = datetime.now(timezone.utc).isoformat()
  return jsonify(annotation)


# Create a new annotation
@annotations_blueprint.route('/annotations', methods=['POST'])
def create_annotation():
    global next_id
    data = request.get_json()
    annotation = {
        'id': next_id,
        'position': data.get('position'),
        'metadata': data.get('metadata'),
        'created_at': datetime.now(timezone.utc).isoformat(),
        'updated_at': datetime.now(timezone.utc).isoformat(),
    }
    annotations[next_id] = annotation
    next_id += 1
    return jsonify(annotation), 201
  
# Remove an existing annotation
@annotations_blueprint.route('/annotations/<int:annotation_id>', methods=['DELETE'])
def delete_annotation(annotation_id):
    if annotation_id in annotations:
        del annotations[annotation_id]
        return jsonify({'message': 'Annotation deleted'})
    else:
        return jsonify({'error': 'Annotation not found'}), 404
