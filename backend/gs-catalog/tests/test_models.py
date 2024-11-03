import pytest
import os


def test_01_get_splat_models_list(client, request):
    """
    Test to get the list of splat models.
    """
    response = client.get("/api/models/splat/list")
    # Check if the status code is 200
    assert (
        response.status_code == 200
    ), f"Expected status code 200, got {response.status_code}"

    json_data = response.get_json()
    expected_data = [
        {"id": "101", "name": "st_comb/st_1", "file": "st_1.splat"},
        {"id": "102", "name": "st_comb/st_2", "file": "st_2.splat"},
        {"id": "103", "name": "RCH", "file": "rch.splat"},
    ]
    # Check if the JSON response matches the expected data
    assert (
        json_data == expected_data
    ), f"Response data {json_data} does not match expected data {expected_data}"


@pytest.mark.parametrize(
    "file_id, file_name",
    [
        ("101", "st_1.splat"),
        ("102", "st_2.splat"),
        ("103", "rch.splat"),
    ],
)
def test_02_get_splat_model_data(client, file_id, file_name):
    response = client.get(f"/api/models/splat/{file_id}")

    # Check if the status code is 200
    assert (
        response.status_code == 200
    ), f"Expected status code 200, got {response.status_code}"

    # Verify Content-Type header for file download
    assert (
        response.headers["Content-Type"] == "application/octet-stream"
    ), f"Expected Content-Type 'application/octet-stream', got {response.headers['Content-Type']}"

    # Verify Content-Disposition header for file attachment
    assert (
        "attachment" in response.headers["Content-Disposition"]
    ), "Expected 'Content-Disposition' to contain 'attachment'"

    # Check if the returned file data matches the expected file data
    file_path = os.path.join("model_files", file_name)  # Path to the local file
    with open(file_path, "rb") as f:
        expected_file_data = f.read()
    assert (
        response.data == expected_file_data
    ), f"Returned file data for {file_id} does not match expected file data"


@pytest.mark.parametrize(
    "invalid_file_id",
    ["999", "abc", "000"],  # Test cases with invalid file IDs
)
def test_03_get_invalid_splat_model_data(client, invalid_file_id):
    response = client.get(f"/api/models/splat/{invalid_file_id}")

    # Check if the status code is 404 for invalid file ID
    assert (
        response.status_code == 404
    ), f"Expected status code 404, got {response.status_code}"

    # Verify response message for file not found
    assert (
        response.data.decode("utf-8") == "Model not found"
    ), f"Expected response 'File not found', got {response.data.decode('utf-8')}"
