import pytest
import json
from fastapi import status
from fastapi.testclient import TestClient
from main import app
from datamodels import ResourceGroupData, ResourceData


client = TestClient(app)
all_resource_groups_json = {}
all_resources_json = {}


# Test adding resource groups
@pytest.mark.parametrize(('resource_group'), (
    (ResourceGroupData(title='3rd/4th')),
    (ResourceGroupData(title='5th/6th')),
))
def test_post_resource_group(resource_group: ResourceGroupData):
    resource_group_json = json.loads(json.dumps(
        resource_group.dict(), indent=4, sort_keys=True, default=str))
    response = client.post('/resource_groups', json=resource_group_json,
                           headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_201_CREATED, f'Error posting {resource_group_json}'
    new_resource_group_json = response.json()
    resource_group_json['id'] = new_resource_group_json['id']
    resource_group_json['resources'] = []
    assert resource_group_json == new_resource_group_json, f'Returned resource_group {new_resource_group_json} does not match posted resource_group {resource_group_json}.'
    all_resource_groups_json[resource_group.title] = new_resource_group_json


# Test getting resource groups
def test_get_resource_groups():
    # Get individually
    compare_resource_group_list = []
    for resource_group_json in all_resource_groups_json.values():
        resource_group_id = resource_group_json['id']
        response = client.get(
            f'/resource_groups/{resource_group_id}', headers=app.test.users.guardian_headers)
        content_type = response.headers['content-type']
        assert response.status_code == status.HTTP_200_OK, f'Error getting {resource_group_json}'
        assert 'application/json' in content_type
        got_resource_group_json = response.json()
        assert resource_group_json == got_resource_group_json, f'Returned resource_group {got_resource_group_json} does not match requested resource_group {resource_group_json}.'
        compare_resource_group_list.append(got_resource_group_json)

    # Get as list
    response = client.get('/resource_groups',
                          headers=app.test.users.guardian_headers)
    content_type = response.headers['content-type']
    assert response.status_code == status.HTTP_200_OK
    assert 'application/json' in content_type
    resource_groups_list = response.json()
    assert resource_groups_list == compare_resource_group_list


# Test updating resource groups
@pytest.mark.parametrize(('resource_group'), (
    (ResourceGroupData(title='3rd/4th')),
    (ResourceGroupData(title='5th/6th')),
))
def test_put_resource_group(resource_group: ResourceGroupData):
    orig_resource_group_json = all_resource_groups_json[resource_group.title]
    resource_group_id = orig_resource_group_json['id']

    orig_title = resource_group.title
    resource_group.title = resource_group.title.replace('3', 'Thi')
    resource_group.title = resource_group.title.replace('4', 'Four')
    resource_group.title = resource_group.title.replace('5', 'Fif')
    resource_group.title = resource_group.title.replace('6', 'Six')
    resource_group_json = json.loads(json.dumps(
        resource_group.dict(), indent=4, sort_keys=True, default=str))

    response = client.put(f'/resource_groups/{resource_group_id}',
                          json=resource_group_json, headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_200_OK, f'Error putting {resource_group_json}'
    new_resource_group_json = response.json()
    resource_group_json['id'] = resource_group_id
    resource_group_json['resources'] = orig_resource_group_json['resources']
    assert resource_group_json == new_resource_group_json, f'Returned resource_group {new_resource_group_json} does not match put resource_group {resource_group_json}.'

    all_resource_groups_json[resource_group.title] = resource_group_json
    del all_resource_groups_json[orig_title]


# Test adding resources
@pytest.mark.parametrize(('resource'), (
    (ResourceData(title='Reading rubrics', url='https://rubrics')),
    (ResourceData(title='Percy Jackson', url='https://percyjacskon')),
))
def test_post_resource(resource: ResourceData):
    resource_group_json = all_resource_groups_json['Third/Fourth']
    resource_group_id = resource_group_json['id']

    resource_json = json.loads(json.dumps(
        resource.dict(), indent=4, sort_keys=True, default=str))
    response = client.post(f'/resource_groups/{resource_group_id}/resources', json=resource_json,
                           headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_201_CREATED, f'Error posting {resource_json}'
    new_resource_json = response.json()
    resource_json['id'] = new_resource_json['id']
    resource_json['group_id'] = new_resource_json['group_id']
    resource_json['list_index'] = new_resource_json['list_index']
    assert resource_json == new_resource_json, f'Returned resource {new_resource_json} does not match posted resource {resource_json}.'
    all_resources_json[resource.title] = new_resource_json


# Test getting resources
def test_get_resources():
    resource_group_json = all_resource_groups_json['Third/Fourth']
    resource_group_id = resource_group_json['id']

    # Get individually
    compare_resources_list = []
    for resource_json in all_resources_json.values():
        resource_id = resource_json['id']
        response = client.get(
            f'/resource_groups/{resource_group_id}/resources/{resource_id}', headers=app.test.users.guardian_headers)
        content_type = response.headers['content-type']
        assert response.status_code == status.HTTP_200_OK, f'Error getting {resource_json}'
        assert 'application/json' in content_type
        got_resource_json = response.json()
        assert resource_json == got_resource_json, f'Returned resource {got_resource_json} does not match requested resource {resource_json}.'
        compare_resources_list.append(got_resource_json)

    # Get as list
    response = client.get(f'/resource_groups/{resource_group_id}/resources/',
                          headers=app.test.users.guardian_headers)
    content_type = response.headers['content-type']
    assert response.status_code == status.HTTP_200_OK
    assert 'application/json' in content_type
    resources_list = response.json()
    assert resources_list == compare_resources_list


# Test updating resources
@pytest.mark.parametrize(('resource'), (
    (ResourceData(title='Reading rubrics', url='https://rubrics2')),
    (ResourceData(title='Percy Jackson', url='https://percyjacskon', list_index=1)),
))
def test_put_resource(resource: ResourceData):
    resource_group_json = all_resource_groups_json['Third/Fourth']
    resource_group_id = resource_group_json['id']

    orig_resource_json = all_resources_json[resource.title]
    resource_id = orig_resource_json['id']

    resource_json = json.loads(json.dumps(
        resource.dict(), indent=4, sort_keys=True, default=str))

    if resource.list_index is None:
        resource_json['list_index'] = orig_resource_json['list_index']

    response = client.put(f'/resource_groups/{resource_group_id}/resources/{resource_id}',
                          json=resource_json, headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_200_OK, f'Error putting {resource_json}'
    new_resource_json = response.json()
    resource_json['id'] = resource_id
    resource_json['group_id'] = orig_resource_json['group_id']
    assert resource_json == new_resource_json, f'Returned resource {new_resource_json} does not match put resource {resource_json}.'

    all_resources_json[resource.title] = resource_json


# Test deleting a resource
def test_delete_resource():
    resource_group_json = all_resource_groups_json['Third/Fourth']
    resource_group_id = resource_group_json['id']

    resource_json = all_resources_json['Reading rubrics']
    resource_id = resource_json['id']
    response = client.delete(
        f'/resource_groups/{resource_group_id}/resources/{resource_id}', headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_200_OK, f'Error deleting {resource_json}'
    response = client.get(
        f'/resource_groups/{resource_group_id}/resources/{resource_id}', headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND


# Test deleting a resource group
def test_delete_resource_group():
    resource_group_json = all_resource_groups_json['Third/Fourth']
    resource_group_id = resource_group_json['id']
    response = client.delete(
        f'/resource_groups/{resource_group_id}', headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_200_OK, f'Error deleting {resource_group_json}'
    response = client.get(
        f'/resource_groups/{resource_group_id}', headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND
