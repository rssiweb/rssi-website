import pytest
from rssiweb import create_app

@pytest.fixture
def client():
    app = create_app({'TESTING': True})

    with app.test_client() as client:
        yield client

def test_empty_db(client):
    """Start with a blank database."""

    res = client.get('/')
    assert res.status_code == 200
