import os
import importlib.util
from datetime import datetime
from flask_jwt_extended import (
    create_access_token, 
    get_jwt_identity, 
    jwt_required, 
    JWTManager
)

# Specify the path to app.py
app_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'app.py'))

# Dynamically load the app.py module
spec = importlib.util.spec_from_file_location("app", app_path)
app_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(app_module)

# Instantiate the App class and access its attributes
app_instance = app_module.App()  # app_instance is now the instance of the App class
app = app_instance.app  # Access the Flask app instance from the App class
mongo = app_instance.mongo.db  # Use the database attribute of PyMongo

# Wrap the functionality inside app context
with app.app_context():
    # Simulating JWT functionality here for testing outside a route
    current_user = get_jwt_identity()

    # Test functions to insert and fetch weight tracking data
    def test_insert_weight_data():
        """
        Test inserting weight tracking data
        """
        sample_data = {
            "email": current_user,
            "week": "2024-W47",
            "weight": 70.0,
            "targetWeight": 60.0,
            "dateUpdated": datetime.utcnow()
        }

        mongo.weight_tracker.update_one(
            {"email": sample_data["email"], "week": sample_data["week"]},
            {"$set": sample_data},
            upsert=True
        )
        print("Test insert completed: Data inserted or updated successfully.")

    def test_fetch_weight_data():
        """
        Test fetching weight tracking data
        """
        email = "test_user@example.com"
        weight_records = list(mongo.weight_tracker.find({"email": email}))
        if weight_records:
            print("Weight tracking records:")
            for record in weight_records:
                print(record)
        else:
            print("No weight records found.")

    # Run the test functions
    if __name__ == "__main__":
        test_insert_weight_data()
        test_fetch_weight_data()
