# tests/test_annotations.py
import json
import pytest

def test_01_list_annotations(client, request):
    test_num = request.node.session.items.index(request.node) + 1
    print(f"Test {test_num}: List Annotations")
    # Test for retrieving annotation list
    data1 = {
        "position": {"x": 16.0, "y": 17.0, "z": 18.0},
        "metadata": {"info": "First annotation"}
    }
    data2 = {
        "position": {"x": 19.0, "y": 20.0, "z": 21.0},
        "metadata": {"info": "Second annotation"}
    }
    # Create annotations
    client.post('/api/annotations', json=data1)
    client.post('/api/annotations', json=data2)
    
    # Retrieve annotation list
    response = client.get('/api/annotations')
    assert response.status_code == 200
    json_data = response.get_json()
    assert len(json_data) == 2
    assert json_data[0]['id'] == 1
    assert json_data[1]['id'] == 2
    
def test_02_create_annotation(client, request):
    test_num = request.node.session.items.index(request.node) + 1
    print(f"Test {test_num}: Create Annotation")
    # Test for creating data
    data = {
        "position": {"x": 1.0, "y": 2.0, "z": 3.0},
        "metadata": {"info": "Sample annotation"}
    }
    response = client.post('/api/annotations', json=data)
    assert response.status_code == 201
    json_data = response.get_json()
    assert json_data['id'] == 1
    assert json_data['position'] == data['position']
    assert json_data['metadata'] == data['metadata']
    
def test_03_get_annotation(client, request):
    test_num = request.node.session.items.index(request.node) + 1
    print(f"Test {test_num}: Get Annotation")
    # Test for retrieving data
    data = {
        "position": {"x": 4.0, "y": 5.0, "z": 6.0},
        "metadata": {"info": "Another annotation"}
    }
    # Create annotation first
    client.post('/api/annotations', json=data)
    
    # Retrieve created annotation
    response = client.get('/api/annotations/1')
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data['id'] == 1
    assert json_data['position'] == data['position']
    assert json_data['metadata'] == data['metadata']

def test_04_update_annotation(client, request):
    test_num = request.node.session.items.index(request.node) + 1
    print(f"Test {test_num}: Update Annotation")
    # Test for updating data
    data = {
        "position": {"x": 7.0, "y": 8.0, "z": 9.0},
        "metadata": {"info": "Initial annotation"}
    }
    # Create annotation first
    client.post('/api/annotations', json=data)
    
    # Update annotation
    update_data = {
        "position": {"x": 10.0, "y": 11.0, "z": 12.0},
        "metadata": {"info": "Updated annotation"}
    }
    response = client.put('/api/annotations/1', json=update_data)
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data['position'] == update_data['position']
    assert json_data['metadata'] == update_data['metadata']

def test_05_delete_annotation(client, request):
    test_num = request.node.session.items.index(request.node) + 1
    print(f"Test {test_num}: Delete Annotation")
    # Test for deleting data
    data = {
        "position": {"x": 13.0, "y": 14.0, "z": 15.0},
        "metadata": {"info": "Annotation to delete"}
    }
    # Create annotation first
    client.post('/api/annotations', json=data)
    
    # Delete annotation
    response = client.delete('/api/annotations/1')
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data['message'] == 'Annotation deleted'
    
    # Try to retrieve deleted annotation
    response = client.get('/api/annotations/1')
    assert response.status_code == 404
