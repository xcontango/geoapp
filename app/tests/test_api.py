import json
import pytest

from rest_framework.test import APIClient


@pytest.mark.django_db
def test_api():
    api = APIClient()
    rsp = api.get('/api/v1/address/', data={'geocode': '38 -80'}, format='json')
    assert rsp.status_code == 200
