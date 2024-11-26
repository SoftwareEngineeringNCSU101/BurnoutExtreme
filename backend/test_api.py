import unittest
from base import api, setup_mongo_client
from unittest.mock import patch, Mock
from flask import request


class APITestCase(unittest.TestCase):

    def setUp(self):
        self.app = api
        self.app.config['TESTING'] = True
        # Set up the mongo client after changing the TESTING flag
        setup_mongo_client(self.app)
        self.client = self.app.test_client()
        print("Using MongoDB client:", type(self.app.mongo_client))

    def test_get_events(self):
        # Create a mock collection
        db = self.app.mongo_client['test']
        collection = db['events']

        # Replace the collection's find method with a Mock object
        mock_find = Mock()
        collection.find = mock_find
        mock_find.return_value = [
            {"_id": "Event 1"},
            {"_id": "Event 2"},
        ]

        response = self.client.get('/events')
        self.assertEqual(response.status_code, 200)

    @patch("pymongo.collection.Collection.update_one")
    def test_register_success(self, mock_update_one):
        app_client = api.test_client()  # Create a test client for this test case

        # Mock the update_one method to simulate a successful registration
        mock_update_one.return_value = Mock(upserted_id=123)

        test_data = {
            'email': 'test_user',
            'password': 'test_password',
            'firstName': 'Test',
            'lastName': 'User'
        }

        response = app_client.post('/register', json=test_data)

        self.assertEqual(response.status_code, 200)

        response_data = response.get_json()
        self.assertEqual(response_data['msg'], "register successful")

    def test_unauthorized_get_user_registered_events(self):
        # Mock the database query result
        app_client = api.test_client()

        # Access the app's Mongo client
        db = app_client.application.mongo_client['test']
        collection = db['user']
        mock_find = Mock()

        collection.find = mock_find
        mock_find.return_value = [
            {"eventTitle": "Yoga"},
            {"eventTitle": "Swimming"}
        ]

        with patch("flask_jwt_extended.get_jwt_identity", return_value="test_user"):
            response = app_client.get('/usersEvents')

        self.assertEqual(response.status_code, 401)

    @patch('base.get_jwt_identity')
    @patch('base.mongo')
    def test_unauthorized_enrolled_true(self, mock_mongo, mock_get_jwt_identity):
        # Mock `get_jwt_identity` to return `None` to simulate an unauthorized user
        mock_get_jwt_identity.return_value = None

        # Create request context for the '/is-enrolled' endpoint
        with self.app.test_request_context('/is-enrolled', method='POST', json={'eventTitle': 'Event Name'}):
            # Now we can call the endpoint
            response = self.client.post('/is-enrolled')

            # Check if the response status code is 401 for unauthorized
            self.assertEqual(response.status_code, 401)

    @patch('base.get_jwt_identity')
    @patch('base.mongo')
    def test_my_profile_unauthorized(self, mock_mongo, mock_get_jwt_identity):
        app_client = api.test_client()
        # Mock get_jwt_identity() to return None, indicating an unauthorized user
        mock_get_jwt_identity.return_value = None

        response = app_client .get('/profile')

        self.assertEqual(response.status_code, 401)

    @patch('base.get_jwt_identity')
    @patch('base.mongo')
    def test_usersEvents_unauthorized(self, mock_mongo, mock_get_jwt_identity):
        app_client = api.test_client()
        # Mock get_jwt_identity() to return None, indicating an unauthorized user
        mock_get_jwt_identity.return_value = None

        response = app_client .get('/usersEvents')

        self.assertEqual(response.status_code, 401)

    @patch('base.get_jwt_identity')
    @patch('base.mongo')
    def test_foodCalorieMapping_unauthorized(self, mock_mongo, mock_get_jwt_identity):
        app_client = api.test_client()
        # Mock get_jwt_identity() to return None, indicating an unauthorized user
        mock_get_jwt_identity.return_value = None

        response = app_client .get('/foodCalorieMapping')

        self.assertEqual(response.status_code, 401)

    @patch('base.get_jwt_identity')
    @patch('base.mongo')
    def test_weekHistory_unauthorized(self, mock_mongo, mock_get_jwt_identity):
        app_client = api.test_client()
        # Mock get_jwt_identity() to return None, indicating an unauthorized user
        mock_get_jwt_identity.return_value = None

        response = app_client .get('/weekHistory')

        self.assertEqual(response.status_code, 405)

    @patch('base.get_jwt_identity')
    @patch('base.mongo')
    def test_caloriesBurned_unauthorized(self, mock_mongo, mock_get_jwt_identity):
        app_client = api.test_client()
        # Mock get_jwt_identity() to return None, indicating an unauthorized user
        mock_get_jwt_identity.return_value = None

        response = app_client .get('/caloriesBurned')

        self.assertEqual(response.status_code, 405)

    @patch('base.get_jwt_identity')
    @patch('base.mongo')
    def test_goalsUpdate_unauthorized(self, mock_mongo, mock_get_jwt_identity):
        app_client = api.test_client()
        # Mock get_jwt_identity() to return None, indicating an unauthorized user
        mock_get_jwt_identity.return_value = None

        response = app_client .get('/goalsUpdate')

        self.assertEqual(response.status_code, 405)

    @patch('base.get_jwt_identity')
    @patch('base.mongo')
    def test_profileUpdate_unauthorized(self, mock_mongo, mock_get_jwt_identity):
        app_client = api.test_client()
        # Mock get_jwt_identity() to return None, indicating an unauthorized user
        mock_get_jwt_identity.return_value = None

        response = app_client .get('/profileUpdate')

        self.assertEqual(response.status_code, 405)

    @patch('base.get_jwt_identity')
    @patch('base.mongo')
    def test_caloriesConsumed_unauthorized(self, mock_mongo, mock_get_jwt_identity):
        app_client = api.test_client()
        # Mock get_jwt_identity() to return None, indicating an unauthorized user
        mock_get_jwt_identity.return_value = None

        response = app_client .get('/caloriesConsumed')

        self.assertEqual(response.status_code, 405)

    @patch('base.get_jwt_identity')
    @patch('base.mongo')
    def test_createFood_success(self, mock_mongo, mock_update_one):
        app_client = api.test_client()

        mock_update_one.return_value = Mock(upserted_id=123)

        test_data = {
            'foodName': 'test_food',
            'calories': 'test_value'
        }

        response = app_client .post('/createFood', json=test_data)

        self.assertEqual(response.status_code, 200)

        response_data = response.get_json()
        self.assertEqual(response_data['status'], "Data saved successfully")

    @patch('base.get_jwt_identity')
    @patch('base.mongo')
    def test_createMeal_unauthorized(self, mock_mongo, mock_get_jwt_identity):
        app_client = api.test_client()

        mock_get_jwt_identity.return_value = None

        test_data = {
            'mealName': 'test_meal',
            'ingredients': ['test_ingredient_1', 'test_ingredient_2']
        }

        response = app_client .post('/createMeal', json=test_data)

        self.assertEqual(response.status_code, 401)

    @patch('base.get_jwt_identity')
    @patch('base.mongo')
    def test_unenroll_unauthorized(self, mock_mongo, mock_get_jwt_identity):
        app_client = api.test_client()

        mock_get_jwt_identity.return_value = None

        test_data = {
            'eventTitle': 'test_title'
        }

        response = app_client .post('/unenroll', json=test_data)

        self.assertEqual(response.status_code, 401)

    @patch('base.get_jwt_identity')
    @patch('base.mongo')
    def test_myMeals_unauthorized(self, mock_mongo, mock_get_jwt_identity):
        app_client = api.test_client()

        mock_get_jwt_identity.return_value = None

        response = app_client .get('/myMeals')

        self.assertEqual(response.status_code, 401)

    @patch('base.get_jwt_identity')
    @patch('base.mongo')
    def test_myWorkouts_unauthorized(self, mock_mongo, mock_get_jwt_identity):
        app_client = api.test_client()

        mock_get_jwt_identity.return_value = None

        response = app_client .get('/mySchedule')

        self.assertEqual(response.status_code, 401)

    @patch('base.get_jwt_identity')
    @patch('base.mongo')
    def test_createWorkouts_unauthorized(self, mock_mongo, mock_get_jwt_identity):
        app_client = api.test_client()

        mock_get_jwt_identity.return_value = None

        response = app_client.post('/createSchedule', json={
            "weekSchedule": {
                "Monday": [],
                "Tuesday": [],
                "Wednesday": [],
                "Thursday": [],
                "Friday": [],
                "Saturday": [],
                "Sunday": []
            }
        })
        self.assertEqual(response.status_code, 401)

    @patch('base.get_jwt_identity')
    @patch('base.mongo')
    def test_deleteSchedule_unauthorized(self, mock_mongo, mock_get_jwt_identity):
        app_client = api.test_client()

        mock_get_jwt_identity.return_value = None

        response = app_client.delete('/deleteSchedule/Monday/Run')

        self.assertEqual(response.status_code, 401)



    @patch('base.get_jwt_identity')
    @patch('base.mongo.weight_tracker.find')
    def test_get_weight_tracker_success(self, mock_find, mock_get_jwt_identity):
        mock_get_jwt_identity.return_value = 'user@example.com'
    
        mock_find.return_value = [{
        '_id': '123456789',
        'week': '2024-W47',
        'weight': 75.0,
        'targetWeight': 70.0
        }]
    
        with self.app.app_context():
            access_token = create_access_token(identity='user@example.com')
    
        headers = {'Authorization': f'Bearer {access_token}'}
        response = self.client.get('/get-weight-tracker', headers=headers)
    
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['week'], '2024-W47')
        self.assertEqual(data[0]['progress'], '5.0 kg from target')

    @patch('base.get_jwt_identity')
    @patch('base.mongo.weight_tracker.find')
    def test_get_weight_tracker_no_records(self, mock_find, mock_get_jwt_identity):
        mock_get_jwt_identity.return_value = 'user@example.com'
        mock_find.return_value = []
    
        with self.app.app_context():
            access_token = create_access_token(identity='user@example.com')
    
        headers = {'Authorization': f'Bearer {access_token}'}
        response = self.client.get('/get-weight-tracker', headers=headers)
    
        self.assertEqual(response.status_code, 404)
        data = response.get_json()
        self.assertEqual(data['message'], 'No weight records found')

    @patch('base.get_jwt_identity')
    def test_get_weight_tracker_unauthorized(self, mock_get_jwt_identity):
        mock_get_jwt_identity.return_value = None
    
        response = self.client.get('/get-weight-tracker')
    
        self.assertEqual(response.status_code, 401)

    @patch('base.get_jwt_identity')
    @patch('base.mongo.weight_tracker.update_one')
    def test_track_weight_success(self, mock_update_one, mock_get_jwt_identity):
        mock_get_jwt_identity.return_value = 'user@example.com'
        mock_update_one.return_value = Mock(matched_count=1)
    
        with self.app.app_context():
            access_token = create_access_token(identity='user@example.com')
    
        headers = {'Authorization': f'Bearer {access_token}'}
        data = {
            'weight': 75.0,
            'week': '2024-W47',
            'targetWeight': 70.0
        }
        response = self.client.post('/track-weight', json=data, headers=headers)
    
        self.assertEqual(response.status_code, 200)
        response_data = response.get_json()
        self.assertEqual(response_data['status'], 'Weight recorded successfully')


if __name__ == "__main__":
    unittest.main()
