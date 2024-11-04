import pytest

def test_01_list_annotations(client):
    # Data setup
    data1 = {
        "position": {"x": 16.0, "y": 17.0, "z": 18.0},
        "metadata": {"info": "First annotation"},
    }
    data2 = {
        "position": {"x": 19.0, "y": 20.0, "z": 21.0},
        "metadata": {"info": "Second annotation"},
    }
    # Create annotations
    response1 = client.post("/api/annotations", json=data1)
    response2 = client.post("/api/annotations", json=data2)

    # Check created annotation IDs
    assert response1.status_code == 201
    assert response2.status_code == 201

    # List annotations
    response = client.get("/api/annotations")
    assert response.status_code == 200
    json_data = response.get_json()
    assert len(json_data) == 2
    returned_ids = [annotation["id"] for annotation in json_data]
    
    # Check if auto-generated `id` is assigned as 1, 2
    assert 1 in returned_ids
    assert 2 in returned_ids

def test_02_create_annotation(client):
    # Test annotation creation
    data = {
        "position": {"x": 1.0, "y": 2.0, "z": 3.0},
        "metadata": {"info": "Sample annotation"},
    }
    response = client.post("/api/annotations", json=data)
    assert response.status_code == 201
    json_data = response.get_json()

    # Check auto-generated `id`
    assert "id" in json_data
    annotation_id = json_data["id"]
    
    # Check data fields
    assert "position" in json_data and json_data["position"] == data["position"]
    assert "metadata" in json_data and json_data["metadata"] == data["metadata"]

def test_03_get_annotation(client):
    # Data setup and creation
    data = {
        "position": {"x": 4.0, "y": 5.0, "z": 6.0},
        "metadata": {"info": "Another annotation"},
    }
    response = client.post("/api/annotations", json=data)
    json_data = response.get_json()
    annotation_id = json_data["id"]

    # Get created annotation
    response = client.get(f"/api/annotations/{annotation_id}")
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data["id"] == annotation_id
    assert json_data["position"] == data["position"]
    assert json_data["metadata"] == data["metadata"]

def test_04_update_annotation(client):
    # Data setup and creation
    data = {
        "position": {"x": 7.0, "y": 8.0, "z": 9.0},
        "metadata": {"info": "Initial annotation"},
    }
    response = client.post("/api/annotations", json=data)
    json_data = response.get_json()
    annotation_id = json_data["id"]

    # Update annotation
    update_data = {
        "position": {"x": 10.0, "y": 11.0, "z": 12.0},
        "metadata": {"info": "Updated annotation"},
    }
    response = client.put(f"/api/annotations/{annotation_id}", json=update_data)
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data["position"] == update_data["position"]
    assert json_data["metadata"] == update_data["metadata"]

def test_05_delete_annotation(client):
    # Data setup and creation
    data = {
        "position": {"x": 13.0, "y": 14.0, "z": 15.0},
        "metadata": {"info": "Annotation to delete"},
    }
    response = client.post("/api/annotations", json=data)
    json_data = response.get_json()
    annotation_id = json_data["id"]

    # Delete annotation
    response = client.delete(f"/api/annotations/{annotation_id}")
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data["message"] == "Annotation deleted"

    # Check 404 response when querying deleted annotation
    response = client.get(f"/api/annotations/{annotation_id}")
    assert response.status_code == 404
