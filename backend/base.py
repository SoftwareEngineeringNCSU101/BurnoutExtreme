import json
import bcrypt
import logging
import requests
import time
from flask_pymongo import PyMongo
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from pymongo import MongoClient
from flask import Flask
import mongomock
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import (
    create_access_token, 
    get_jwt, 
    get_jwt_identity, 
    unset_jwt_cookies, 
    jwt_required, 
    JWTManager
)
from datetime import datetime, timedelta
from functools import reduce
from bson import json_util
from pymongo import MongoClient
from flasgger import Swagger
import os
from llama_index.llms.ollama import Ollama  
from mistralai import Mistral
import ollama

api = Flask(__name__)
api.secret_key = 'secret'
api.config["JWT_SECRET_KEY"] = "softwareEngineering"
api.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(api)
mongo = None

Swagger(api)


def setup_mongo_client(app):
    global mongo
    if app.config['TESTING']:
        # Use mongomock for testing
        app.mongo_client = mongomock.MongoClient()
        mongo = app.mongo_client["test"]
    else:
        # Use a real MongoDB connection for production
        app.mongo_client = MongoClient('localhost', 27017)
        mongo = app.mongo_client["test"]


# Call setup_mongo_client during normal (non-test) app initialization
setup_mongo_client(api)


@api.route('/token', methods=["POST"])  # pragma: no cover
def create_token():
    """
    Create a new access token

    ---
    tags:
      - Authentication
    parameters:
      - name: email
        in: formData
        type: string
        required: true
        description: User email
      - name: password
        in: formData
        type: string
        required: true
        description: User password
    responses:
      200:
        description: Login successful
      401:
        description: Invalid email or password
    """
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    user = mongo.user.find_one({"email": email})
    if user is not None and bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8')):
        access_token = create_access_token(identity=email)
        return jsonify({"message": "Login successful", "access_token": access_token})
    else:
        print("Invalid email or password")
        return jsonify({"message": "Invalid email or password"}), 401


@api.route("/google-login", methods=["POST"])
def google_login():
    email = request.json.get("email", None)
    firstName = request.json.get("first_name", None)
    lastName = request.json.get("last_name", None)
    user = mongo.user.find_one({"email": email})
    if (user is None):
        mongo.user.insert_one(
            {"email": email, "first_name": firstName, "last_name": lastName})
    access_token = create_access_token(identity=email)
    return jsonify({"message": "Login successful", "access_token": access_token})


@api.route("/register", methods=["POST"])
def register():
    """
    Register a new user

    ---
    tags:
      - User Registration
    parameters:
      - name: email
        in: formData
        type: string
        required: true
        description: User email
      - name: password
        in: formData
        type: string
        required: true
        description: User password
      - name: firstName
        in: formData
        type: string
        required: true
        description: User's first name
      - name: lastName
        in: formData
        type: string
        required: true
        description: User's last name
    responses:
      200:
        description: Registration successful
      409:
        description: User already exists
      500:
        description: Registration failed
    """

    email = request.json.get('email', None)
    password = request.json.get('password', None)
    first_name = request.json.get('firstName', None)
    last_name = request.json.get('lastName', None)

    # Encrypt the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    new_document = {
        "email": email,
        "password": hashed_password.decode('utf-8'),
        "first_name": first_name,
        "last_name": last_name,
    }
    query = {
        "email": email,
    }
    try:
        inserted = mongo.user.update_one(
            query, {"$set": new_document}, upsert=True)
        if (inserted.upserted_id):
            response = jsonify({"msg": "register successful"})
        else:
            print("User already exists")
            response = jsonify({"msg": "User already exists"})
    except Exception as e:
        response = jsonify({"msg": "register failed"})

    return response


@api.route("/logout", methods=["POST"])
def logout():
    """
    Logout the user and clear their session

    ---
    tags:
      - User Logout
    responses:
      200:
        description: Logout successful
    """
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


@api.route('/events', methods=['GET'])
def get_events():
    """
    Retrieve a list of events

    This endpoint retrieves a list of events from the database.

    ---
    tags:
      - Events
    responses:
      200:
        description: A list of events
        schema:
          type: array
          items:
            type: object
            properties:
              _id:
                type: string
              # Add more properties as needed
      404:
        description: No events found
    """
    events_collection = mongo.events
    events = list(events_collection.find({}))
    for event in events:
        event["_id"] = str(event["_id"])  # Convert ObjectId to string
    return jsonify(events)


@api.route('/is-enrolled', methods=['POST'])
@jwt_required()
def is_enrolled():
    """
    Check if the user is enrolled in an event

    This endpoint checks if the authenticated user is enrolled in a specific event.

    ---
    tags:
      - Events
    parameters:
      - in: body
        name: data
        description: Data containing the eventTitle
        required: true
        schema:
          type: object
          properties:
            eventTitle:
              type: string
        example:
          eventTitle: "Event Name"
    security:
      - JWT: []
    responses:
      200:
        description: Indicates whether the user is enrolled
        schema:
          type: object
          properties:
            isEnrolled:
              type: boolean
      401:
        description: Unauthorized access
    """

    data = request.get_json()
    eventTitle = data['eventTitle']
    current_user = get_jwt_identity()
    enrollment = mongo.user.find_one(
        {"email": current_user, "eventTitle": eventTitle})

    if enrollment:
        return jsonify({"isEnrolled": True})
    else:
        return jsonify({"isEnrolled": False})


@api.route('/enroll', methods=['POST'])  # pragma: no cover
@jwt_required()
def enroll_event():  # pragma: no cover
    """
    Enroll the user in an event

    This endpoint allows an authenticated user to enroll in an event.

    ---
    tags:
      - Events
    parameters:
      - in: body
        name: data
        description: Data containing the eventTitle
        required: true
        schema:
          type: object
          properties:
            eventTitle:
              type: string
        example:
          eventTitle: "Event Name"
    security:
      - JWT: []
    responses:
      200:
        description: User successfully enrolled in the event
        schema:
          type: object
          properties:
            status:
              type: string
              example: "Data saved successfully"
      500:
        description: An error occurred while enrolling the user
    """
    data = request.get_json()  # get data from POST request
    current_user = get_jwt_identity()
    try:
        # Insert data into MongoDB
        mongo.user.insert_one({
            "email": current_user,
            "eventTitle": data['eventTitle'],
            "eventDate": data['eventDate']
        })
        response = {"status": "Data saved successfully"}
    except Exception as e:
        response = {"status": "Error", "message": str(e)}

    return jsonify(response)


@api.route('/unenroll', methods=['POST'])  # pragma: no cover
@jwt_required()
def unenroll_event():  # pragma: no cover
    """
    Unenroll the user from an event

    This endpoint allows an authenticated user to unenroll from an event.

    ---
    tags:
      - Events
    parameters:
      - in: body
        name: data
        description: Data containing the eventTitle
        required: true
        schema:
          type: object
          properties:
            eventTitle:
              type: string
        example:
          eventTitle: "Event Name"
    security:
      - JWT: []
    responses:
      200:
        description: User successfully unenrolled from the event
        schema:
          type: object
          properties:
            status:
              type: string
              example: "Data saved successfully"
      500:
        description: An error occurred while unenrolling the user
    """
    data = request.get_json()  # get data from POST request
    current_user = get_jwt_identity()
    try:
        # Insert data into MongoDB
        mongo.user.delete_one({
            "email": current_user,
            "eventTitle": data['eventTitle']
        })
        response = {"status": "Data saved successfully"}
    except Exception as e:
        response = {"status": "Error", "message": str(e)}

    return jsonify(response)


@api.route('/profile')
@jwt_required()
def my_profile():  # pragma: no cover
    """
    Retrieve user profile information

    This endpoint allows an authenticated user to retrieve their profile information.

    ---
    tags:
      - User
    security:
      - JWT: []
    responses:
      200:
        description: User profile information retrieved successfully
        schema:
          type: object
        example:
          {
            "_id": "12345",
            "email": "user@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "age": 30,
            "weight": 70,
            "height": 175
          }
      401:
        description: Unauthorized. User must be logged in to access their profile.
      404:
        description: User profile not found.
      500:
        description: An error occurred while retrieving the user profile.
    """
    current_user = get_jwt_identity()
    profile = mongo.user.find_one({"email": current_user})
    return jsonify(json_util.dumps(profile))


@api.route('/caloriesConsumed', methods=["POST"])
@jwt_required()
def addUserConsumedCalories():  # pragma: no cover
    """
    Add consumed calories for a user

    This endpoint allows an authenticated user to add consumed calories for a specific date.

    ---
    tags:
      - User
    security:
      - JWT: []
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            intakeDate:
              type: string
              format: date
              description: The date for which calories are being recorded (e.g., "2023-10-17").
            intakeFoodItem:
              type: string
              description: The name of the food item.
            intakeCalories:
              type: integer
              description: The number of calories consumed for the food item.
    responses:
      200:
        description: Calories consumed data saved successfully.
        schema:
          type: object
        example:
          {
            "status": "Data saved successfully"
          }
      401:
        description: Unauthorized. User must be logged in to add consumed calories.
      500:
        description: An error occurred while saving consumed calories data.
    """
    data = request.get_json()  # get data from POST request
    current_user = get_jwt_identity()
    try:
        # Insert data into MongoDB
        mongo.user.update_one({'email': current_user, "consumedDate": data['intakeDate']}, {"$push": {
                              "foodConsumed": {"item": data["intakeFoodItem"], "calories": data["intakeCalories"]}}}, upsert=True)
        response = {"status": "Data saved successfully"}
        statusCode = 200
    except Exception as e:
        response = {"status": "Error", "message": str(e)}
        statusCode = 500
    return jsonify(response), statusCode


@api.route('/profileUpdate', methods=["POST"])
@jwt_required()
def profileUpdate():  # pragma: no cover
    """
    Update user profile

    This endpoint allows an authenticated user to update their profile information.

    ---
    tags:
      - User
    security:
      - JWT: []
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            firstName:
              type: string
              description: The user's first name.
            lastName:
              type: string
              description: The user's last name.
            age:
              type: integer
              description: The user's age.
            weight:
              type: number
              description: The user's weight.
            height:
              type: number
              description: The user's height.
            sex:
              type: string
              description: The user's sex.
    responses:
      200:
        description: User profile updated successfully.
        schema:
          type: object
        example:
          {
            "msg": "Update successful"
          }
      401:
        description: Unauthorized. User must be logged in to update their profile.
      500:
        description: An error occurred while updating the user's profile.
    """
    current_user = get_jwt_identity()
    first_name = request.json.get('firstName', None)
    last_name = request.json.get('lastName', None)
    age = request.json.get('age', None)
    weight = request.json.get('weight', None)
    height = request.json.get('height', None)
    sex = request.json.get('sex', None)
    activityLevel = request.json.get('activityLevel', None)
    bmi = (0.453*float(weight))/((0.3048*float(height))**2)
    bmi = round(bmi, 2)
    tdee = calculate_tdee(height, weight, age, sex, activityLevel)
    new_document = {
        "first_name": first_name,
        "last_name": last_name,
        "age": age,
        "weight": weight,
        "height": height,
        "sex": sex,
        "bmi": bmi,
        "target_calories": tdee,
    }
    query = {
        "email": current_user,
    }
    try:
        mongo.user.update_one(query, {"$set": new_document}, upsert=True)
        response = jsonify({"msg": "update successful"})
    except Exception as e:
        response = jsonify({"msg": "update failed"})

    return response


@api.route('/goalsUpdate', methods=["POST"])
@jwt_required()
def goalsUpdate():  # pragma: no cover
    """
    Update user goals

    This endpoint allows an authenticated user to update their fitness goals, such as target weight, target calories, and target goal.

    ---
    tags:
      - User
    security:
      - JWT: []
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            targetWeight:
              type: number
              description: The user's target weight goal.
            targetCalories:
              type: number
              description: The user's target daily calorie intake goal.
            activityLevel:
              type: string
              description: The user's activity level.
    responses:
      200:
        description: User goals updated successfully.
        schema:
          type: object
        example:
          {
            "msg": "Update successful"
          }
      401:
        description: Unauthorized. User must be logged in to update their goals.
      500:
        description: An error occurred while updating the user's goals.
    """
    current_user = get_jwt_identity()
    targetWeight = request.json.get('targetWeight', None)
    activityLevel = request.json.get('activityLevel', None)

    new_document = {
        "target_weight": targetWeight,
        "activity_level": activityLevel
    }
    query = {
        "email": current_user,
    }
    try:
        profile = mongo.user.find_one(query)
        tdee = calculate_tdee(
            profile["height"], profile["weight"], profile["age"], profile["sex"], activityLevel)
        if tdee:
            new_document["target_calories"] = tdee
        mongo.user.update_one(query, {"$set": new_document}, upsert=True)
        response = jsonify({"msg": "update successful"})
    except Exception as e:
        response = jsonify({"msg": "update failed"})

    return response


@api.route('/caloriesBurned', methods=["POST"])
@jwt_required()
def addUserBurnedCalories():  # pragma: no cover
    """
    Add user's burned calories

    This endpoint allows an authenticated user to add information about calories burned on a specific date.

    ---
    tags:
      - User
    security:
      - JWT: []
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            burnoutDate:
              type: string
              format: date
              description: The date on which calories were burned.
            burntoutCalories:
              type: number
              description: The number of calories burned on the specified date.
    responses:
      200:
        description: Calories burned data saved successfully.
        schema:
          type: object
        example:
          {
            "status": "Data saved successfully"
          }
      401:
        description: Unauthorized. User must be logged in to add burned calories data.
      500:
        description: An error occurred while saving the burned calories data.
    """
    data = request.get_json()  # get data from POST request
    current_user = get_jwt_identity()
    try:
        # Insert data into MongoDB
        mongo.user.update_one({'email': current_user, "consumedDate": data['burnoutDate']}, {
                              "$inc": {"burntCalories": int(data["burntoutCalories"])}}, upsert=True)
        response = {"status": "Data saved successfully"}
        statusCode = 200
    except Exception as e:
        response = {"status": "Error", "message": str(e)}
        statusCode = 500
    return jsonify(response), statusCode


@api.route('/addWeight', methods=["POST"])
@jwt_required()
def addUserWeight():  # pragma: no cover
    """
    Add user's weight

    This endpoint allows an authenticated user to add their weight for a specific date.

    ---
    tags:
      - User
    security:
      - JWT: []
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            weightDate:
              type: string
              format: date
              description: The date for the weight entry.
            todaysWeight:
              type: number
              description: The user's weight on the specified date.
    responses:
      200:
        description: Weight data saved successfully.
        schema:
          type: object
        example:
          {
            "status": "Data saved successfully"
          }
      401:
        description: Unauthorized. User must be logged in to add weight data.
      500:
        description: An error occurred while saving the weight data.
    """
    data = request.get_json()  # get data from POST request
    print(data)
    current_user = get_jwt_identity()
    try:
        # Insert or update weight data into MongoDB
        mongo.user.update_one(
            {'email': current_user, "weightDate": data['weightDate']},
            {"$set": {"weight": float(data["todaysWeight"])}},
            upsert=True
        )
        response = {"status": "Data saved successfully"}
        statusCode = 200
    except Exception as e:
        response = {"status": "Error", "message": str(e)}
        statusCode = 500
    return jsonify(response), statusCode



@api.route('/createFood', methods=["POST"])
def createFood():
    """
    Create a custom food

    This endpoint allows an authenticated user to create their custom food item with the amount of calories it has.

    ---
    tags:
      - User
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            foodName:
              type: string
              format: food item name
              description: The name of the food item being created.
            calories:
              type: number
              description: The number of calories in the created food item.
    responses:
      200:
        description: Food item created successfully
        schema:
          type: object
        example:
          {
            "status": "Data saved successfully"
          }
      401:
        description: Unauthorized. User must be logged in to create custom food.
      500:
        description: An error occurred while creating the custom food.

    """
    data = request.get_json()  # get data from POST request
    foodName = data['foodName']
    calories = data['calories']
    
    try:
        # Insert data into MongoDB
        mongo.food.insert_one({'food': foodName, "calories": calories})
        response = {"status": "Data saved successfully"}
        statusCode = 200
    except Exception as e:
        response = {"status": "Error", "message": str(e)}
        statusCode = 500
    return jsonify(response), statusCode


@api.route('/createMeal', methods=["POST"])
@jwt_required()
def createMeal():
    """
    Create a custom meal

    This endpoint allows an authenticated user to create their own meals with different food items as the ingredients.

    ---
    tags:
      - User
    security:
      - JWT: []
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            mealName:
              type: string
              format: Meal name
              description: The name of the meal item being created.
            ingredients:
              type: list
              description: Is a list of the ingredients in the meal.
    responses:
      200:
        description: Meal created successfully
        schema:
          type: object
        example:
          {
            "status": "Data saved successfully"
          }
      401:
        description: Unauthorized. User must be logged in to create custom meal.
      500:
        description: An error occurred while creating the custom meal.

    """
    data = request.get_json()  # get data from POST request
    current_user = get_jwt_identity()
    mealName = data['mealName']
    ingredients = data['ingredients']
    calories = 0
    ingredientCalories = []
    for item in ingredients:
        food_item = mongo.food.find_one({"food": item})
        calories += int(food_item["calories"])
        ingredientCalories.append(int(food_item["calories"]))
    try:
        # Insert data into MongoDB
        mongo.food.insert_one({'food': mealName, "calories": calories})
        mongo.user.insert_one({
            "email": current_user,
            "meal_name": mealName,
            "ingredients": ingredients,
            "ingredientCalories": ingredientCalories,
            "total_calories": calories
        })
        response = {"status": "Data saved successfully"}
        statusCode = 200
    except Exception as e:
        response = {"status": "Error", "message": str(e)}
        statusCode = 500
    return jsonify(response), statusCode


@api.route('/weekHistory', methods=["POST"])
@jwt_required()
def getWeekHistory():  # pragma: no cover
    """
    Get user's weekly history

    This endpoint allows an authenticated user to retrieve their food consumption and calories burned history for the past week.

    ---
    tags:
      - User
    security:
      - JWT: []
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            todayDate:
              type: string
              format: date
              description: The date for the end of the week (today's date).
    responses:
      200:
        description: Successfully retrieved the user's weekly history.
        schema:
          type: array
          items:
            type: object
            properties:
              dayIndex:
                type: integer
                description: Integer from 0 to 6 representing the day index.
              date:
                type: string
                format: date
                description: The date for each day in the week.
              foodConsumed:
                type: array
                items:
                  type: object
                  properties:
                    item:
                      type: string
                      description: Food item name.
                    calories:
                      type: number
                      description: Calories consumed from the food item.
                description: A list of dictionaries containing food items and their consumed calories.
              caloriesConsumed:
                type: number
                description: The sum of all calories consumed for that day.
              exceededDailyLimit:
                type: boolean
                description: Indicates whether the calories consumed exceeded the daily limit.
              burntCalories:
                type: number
                description: Calories burned on that day.
        example:
          [
            {
              "dayIndex": 0,
              "date": "10/13/2023",
              "foodConsumed": [
                {
                  "item": "Chicken Salad",
                  "calories": 500
                },
                {
                  "item": "Onion Soup",
                  "calories": 300
                },
                {
                  "item": "Potato Salad",
                  "calories": 500
                },
                {
                  "item": "Cheese Burger",
                  "calories": 500
                }
              ],
              "caloriesConsumed": 1800,
              "exceededDailyLimit": false,
              "burntCalories": 1200
            },
            {
              "dayIndex": 1,
              "date": "10/12/2023",
              "foodConsumed": [...],
              "caloriesConsumed": ...,
              "exceededDailyLimit": ...,
              "burntCalories": ...
            },
            ...
          ]
      401:
        description: Unauthorized. User must be logged in to retrieve weekly history.
      500:
        description: An error occurred while retrieving the user's weekly history.
    """
    data = request.get_json()  # get data from POST request
    current_user = get_jwt_identity()
    todayDate = datetime.strptime(data["todayDate"], "%m/%d/%Y")
    dates = [(todayDate-timedelta(days=x)).strftime("%m/%d/%Y")
             for x in range(7)]
    calorieLimit = 1000
    result = []
    try:
        for index, dateToFind in enumerate(dates):
            # Every day's res item should like this
            # {
            #   dayIndex: 0,               #Interger from 0-6
            #   date: "10/13/2023",        #Date 0=today, 6=7th day ago from today
            #   foodConsumed: [            # A list of dicts, each dict contains a food item and its calories
            #     {
            #       item: "Chicken Salad",
            #       calories: 500,
            #     },
            #     {
            #       item: "Onion Soup",
            #       calories: 300,
            #     },
            #     {
            #       item: "Potato Salad",
            #       calories: 500,
            #     },
            #     {
            #       item: "Cheese Burger",
            #       calories: 500,
            #     },
            #   ],
            #   caloriesConsumed: 1800,    # the sum of all calories consumed from above list
            #   exceededDailyLimit: false, # true or false based on whether caloriesConsumed is > limit user set
            #   burntCalories: 1200,       # calories burnt out on that day
            # }
            res = {}
            data = mongo.user.find_one(
                {'email': current_user, "consumedDate": dateToFind})
            if data:
              print(data)
            res["dayIndex"] = index
            res["date"] = dateToFind
            if data:
                if "foodConsumed" in data:
                    res["foodConsumed"] = data["foodConsumed"]
                    res["caloriesConsumed"] = reduce(
                        lambda a, b: a+b, [int(item["calories"]) for item in data["foodConsumed"]])
                    res["exceededDailyLimit"] = res["caloriesConsumed"] > calorieLimit
                if "burntCalories" in data:
                    res["burntCalories"] = data["burntCalories"]
            if "foodConsumed" not in res:
                res["foodConsumed"] = []
            if "caloriesConsumed" not in res:
                res["caloriesConsumed"] = 0
            if "burntCalories" not in res:
                res["burntCalories"] = 0
            if "exceededDailyLimit" not in res:
                res["exceededDailyLimit"] = False
            result.append(res)
        response = result
        statusCode = 200
    except Exception as e:
        response = {"status": "Error", "message": str(e)}
        statusCode = 500
    print("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
    print(result[0])
    return jsonify(response), statusCode


@api.route('/weightHistory', methods=["POST"])
@jwt_required()
def getWeightHistory():  # pragma: no cover
    """
    Get user's weekly weight history

    This endpoint allows an authenticated user to retrieve their weight history for the past week.

    ---
    tags:
      - User
    security:
      - JWT: []
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            todayDate:
              type: string
              format: date
              description: The date for the end of the week (today's date).
    responses:
      200:
        description: Successfully retrieved the user's weekly weight history.
        schema:
          type: array
          items:
            type: object
            properties:
              dayIndex:
                type: integer
                description: Integer from 0 to 6 representing the day index.
              date:
                type: string
                format: date
                description: The date for each day in the week.
              weight:
                type: number
                description: The user's weight on that day.
        example:
          [
            {
              "dayIndex": 0,
              "date": "10/13/2023",
              "weight": 180
            },
            {
              "dayIndex": 1,
              "date": "10/12/2023",
              "weight": 179
            },
            ...
          ]
      401:
        description: Unauthorized. User must be logged in to retrieve weekly history.
      500:
        description: An error occurred while retrieving the user's weekly weight history.
    """
    data = request.get_json()  # get data from POST request
    current_user = get_jwt_identity()
    todayDate = datetime.strptime(data["todayDate"], "%m/%d/%Y")
    dates = [(todayDate - timedelta(days=x)).strftime("%m/%d/%Y")
             for x in range(7)]
    result = []
    try:
        for index, dateToFind in enumerate(dates):
            # Every day's res item should look like this:
            # {
            #   dayIndex: 0,              # Integer from 0-6
            #   date: "10/13/2023",       # Date 0=today, 6=7th day ago from today
            #   weight: 180               # The weight recorded on that day
            # }
            res = {}
            data = mongo.user.find_one(
                {'email': current_user, "weightDate": dateToFind})
            if data:
                res["dayIndex"] = index
                res["date"] = dateToFind
                res["weight"] = data.get("weight", 0)  # Get the weight, default to 0 if not available
            else:
                res["dayIndex"] = index
                res["date"] = dateToFind
                res["weight"] = 0  # Default value if no data found for the day
            result.append(res)
        response = result
        statusCode = 200
    except Exception as e:
        response = {"status": "Error", "message": str(e)}
        statusCode = 500
    return jsonify(response), statusCode



@api.route("/myMeals", methods=["GET"])
@jwt_required()
def getMyMeals():
    """
    Get My Meals

    This endpoint allows an authenticated user to retrieve the custom meals that they have created.

    ---
    tags:
      - User
      - Meals
    security:
      - JWT: []
    responses:
      200:
        description: Successfully retrieved the custom meals created by user
        schema:
          type: object
          properties:
            mealName:
              type: string
              description: Name of the custom meal
            ingredients:
              type: array
              description: List of ingredients in the meal
          example:
            {
            "mealName":"My meal",
            "ingredients":["Eggs","Toast"],
            }
      401:
        description: Unauthorized. User must be logged in to retrieve the food calorie mapping.
      500:
        description: An error occurred while retrieving the food calorie mapping.
    """
    current_user = get_jwt_identity()
    result = []
    try:
        data = mongo.user.find(
            {"email": current_user, "meal_name": {"$exists": True}})
        for meal in data:
            cal_info = []
            for item in meal['ingredients']:
                food_item = mongo.food.find_one({'food': item})
                cal_info.append({str(item): food_item['calories']})
            res = {}
            res['meal_name'] = meal['meal_name']
            res['ingredients'] = meal['ingredients']
            res['ingredientCalories'] = meal.get('ingredientCalories', [])
            res['total_calories'] = meal['total_calories']
            result.append(res)
        response = result
        statusCode = 200
    except Exception as e:
        response = {"status": "Error", "message": str(e)}
        statusCode = 500
    return jsonify(response), statusCode


@api.route('/foodCalorieMapping', methods=["GET"])
@jwt_required()
def getFoodCalorieMapping():
    """
    Get food calorie mapping

    This endpoint allows an authenticated user to retrieve a mapping of food items to their respective calorie values.

    ---
    tags:
      - Food
    security:
      - JWT: []
    responses:
      200:
        description: Successfully retrieved the food calorie mapping.
        schema:
          type: object
          properties:
            foodItem:
              type: integer
              description: Food item name.
            calories:
              type: number
              description: Calories associated with the food item.
        example:
          {
            "Potato": 50,
            "Acai": 20,
            "Cheeseburger": 80,
            ...
          }
      401:
        description: Unauthorized. User must be logged in to retrieve the food calorie mapping.
      500:
        description: An error occurred while retrieving the food calorie mapping.
    """
    try:
        data = mongo.food.find()
        # Response should be in this format {foodItem: calories, foodItem: calories....}
        # For Example { Potato: 50, Acai: 20, Cheeseburger: 80 }
        response = {item["food"]: item["calories"] for item in data}
        statusCode = 200
    except Exception as e:
        response = {"status": "Error", "message": str(e)}
        statusCode = 500
    return jsonify(response), statusCode


@api.route('/usersEvents', methods=["GET"])
@jwt_required()
def getUserRegisteredEvents():
    """
    Get user's registered events

    This endpoint allows an authenticated user to retrieve the events they are registered for.

    ---
    tags:
      - Events
    security:
      - JWT: []
    responses:
      200:
        description: Successfully retrieved the user's registered events.
        schema:
          type: array
          items:
            type: object
            properties:
              eventName:
                type: string
                description: Name of the event.
              date:
                type: string
                format: date
                description: Date of the event.
            example:
              [
                {
                  "eventName": "Yoga",
                  "date": "2023-12-11"
                },
                {
                  "eventName": "Swimming",
                  "date": "2023-11-10"
                },
                ...
              ]
      401:
        description: Unauthorized. User must be logged in to retrieve their registered events.
      500:
        description: An error occurred while retrieving the user's registered events.
    """
    try:
        # current_user = get_jwt_identity()
        current_user = get_jwt_identity()
        data = mongo.user.find(
            {"email": current_user, "eventTitle": {"$exists": True}})
        response = []
        for item in data:
            res = {"eventName": item["eventTitle"], "date": item["eventDate"]}
            response.append(res)
        statusCode = 200
    except Exception as e:
        response = {"status": "Error", "message": str(e)}
        statusCode = 500
    return jsonify(response), statusCode


def calculate_tdee(height, weight, age, sex, activityLevel):
    if height and weight and age and sex and activityLevel:
        pass
    else:
        return None
    kg_weight = float(weight)*0.45359237
    cm_height = float(height)*30.48
    common_calc_for_male_female = (
        10*kg_weight) + (6.25*cm_height) - (5*int(age))
    if sex == "Male":
        bmr = common_calc_for_male_female + 5
    else:
        bmr = common_calc_for_male_female - 161
    personal_activity_levels = {
        'Minimal': 1.2, 'Light': 1.375, 'Moderate': 1.55, 'Heavy': 1.725, 'Athlete': 1.9}
    tdee = int((bmr * personal_activity_levels[activityLevel]))
    return tdee


@api.route('/trackActivity', methods=["POST"])
@jwt_required()
def track_activity():
    data = request.get_json()
    current_user = get_jwt_identity()

    steps = data.get('steps', 0)
    calories_burned = data.get('calories_burned', 0)
    # default to 'low' if not provided
    workout_intensity = data.get('workout_intensity', 'low')
    activity_date = data.get(
        'activity_date', datetime.now(timezone.utc).isoformat())

    try:
        # Insert or update activity data into MongoDB
        mongo.user.update_one(
            {'email': current_user, 'activity_date': activity_date},
            {
                "$set": {
                    "steps": steps,
                    "calories_burned": calories_burned,
                    "workout_intensity": workout_intensity,
                }
            },
            upsert=True
        )
        response = {"status": "Activity tracked successfully for user."}
        statusCode = 200
    except Exception as e:
        response = {"status": "Error", "message": str(e)}
        statusCode = 500

    return jsonify(response), statusCode


@api.route('/createSchedule', methods=["POST"])
@jwt_required()
def createSchedule():
    data = request.get_json()
    current_user = get_jwt_identity()
    week_schedule = data['weekSchedule']

    try:
        # Replace the existing schedule if it exists, or insert a new one
        result = mongo.schedules.replace_one(
            {'user_id': current_user},  # Filter by user_id to check existence
            # New or updated schedule data
            {'user_id': current_user, 'week_schedule': week_schedule},
            upsert=True  # Create a new document if none exists
        )

        if result.matched_count > 0:
            # A schedule was replaced (old one existed)
            response = {"status": "Schedule updated successfully"}
        else:
            # No matching schedule found, so a new one was created
            response = {"status": "Schedule created successfully"}

        status_code = 200
    except Exception as e:
        response = {"status": "Error", "message": str(e)}
        status_code = 500

    return jsonify(response), status_code


@api.route('/mySchedule', methods=["GET"])
@jwt_required()  # Ensure the decorator has parentheses
def my_schedules():
    try:
        current_user = get_jwt_identity()
        user_schedules = mongo.schedules.find_one({"user_id": current_user})

        if user_schedules:
            response = {
                "status": "Success",
                "data": user_schedules['week_schedule']
            }
            statusCode = 200
        else:
            response = {"status": "Error",
                        "message": "No schedules found for the user."}
            statusCode = 404

    except Exception as e:
        response = {"status": "Error", "message": str(e)}
        statusCode = 500

    return jsonify(response), statusCode


@api.route('/deleteSchedule/<string:selected_day>/<string:workout_title>', methods=["DELETE"])
@jwt_required()
def deleteSchedule(selected_day, workout_title):
    current_user = get_jwt_identity()

    try:
        # Find the user's schedule
        user_schedule = mongo.schedules.find_one({"user_id": current_user})

        if not user_schedule:
            return jsonify({"status": "Error", "message": "No schedule found for the user."}), 404

        # Filter out the workout to be removed from the specified day
        week_schedule = user_schedule['week_schedule']
        if selected_day in week_schedule:
            # Remove the workout from the specified day's array
            week_schedule[selected_day] = [
                workout for workout in week_schedule[selected_day]
                if workout['workoutTitle'] != workout_title
            ]

            # Update the user's schedule in the database
            mongo.schedules.update_one(
                {'user_id': current_user},
                {'$set': {'week_schedule': week_schedule}}
            )

            return jsonify({"status": "Success", "message": "Workout removed successfully."}), 200
        else:
            return jsonify({"status": "Error", "message": f"No workouts found for {selected_day}."}), 404

    except Exception as e:
        return jsonify({"status": "Error", "message": str(e)}), 500

logging.basicConfig(level=logging.ERROR)


@api.route("/generateFitnessPlan", methods=["POST"])
@jwt_required()
def generateFitnessPlan():
    """
    Generate fitness plan based on user's info

    This endpoint allows an authenticated user to retrieve the user's info, use Mistral AI to generate a fitness plan

    ---
    tags:
      - Events
    security:
      - JWT: []
    responses:
      200:
        description: Successfully retrieved the user's info and generated a fitness plan
        schema:
          type: object
          properties:
            fitness_plan:
              type: String
              description: String in the format of html to be rendered easily
            calories:
      401:
        description: Unauthorized. User must be logged in to retrieve their registered events.
      500:
        description: An error occurred while retrieving the user's info/in generating the fitness plan
    """
    try:
        current_user = get_jwt_identity()
        user_data = mongo.user.find_one({"email": current_user})
        print("User Data:", user_data)

        if user_data:
            fitness_plan = generate_fitness_plan(user_data)
            mongo.user.update_one({"email": current_user},{"$set": {"fitness_plan": fitness_plan}})
            response = {
                "status": "Success",
                "fitness_plan": fitness_plan
            }
            statusCode = 200
        else:
            response = {
                "status": "Not Found",
                "message": "User not found."
            }
            statusCode = 404
    except Exception as e:
        response = {"status": "Error", "message": str(e)}
        statusCode = 500
    
    return jsonify(response), statusCode    

def generate_fitness_plan(user_data):

    prompt = (
        f"You are a fitness coach. Generate and stick to the fitness plan in plain text with html tags such as <b>,<h>,<br> for new lines; don't use markdown for the format below. You can add the relevant suggestions for each column and add <br> after every meal/exercise."
        f"1. Nutrition Plan : Meals/Hydration etc"
        f"2. Workout Plan: Depending on activity level"
        f"3. Any other comments"
        f"for the user having the attributes: "
        f"first name: {user_data['first_name']}, "
        f"last name: {user_data['last_name']}, "
        f"age: {user_data['age']}, "
        f"weight: {user_data['weight']} lbs, "
        f"height: {user_data['height']} feet, "
        f"BMI: {user_data['bmi']}, "
        f"sex: {user_data['sex']}, "
        f"activity level: {user_data['activity_level']}, "
        f"target calories: {user_data['target_calories']}, "
        f"target weight: {user_data['target_weight']} lbs."
    )

    response = ollama.generate(
        model='llama3.2', 
        prompt=prompt
    )
    print(response)
    return response['response']

@api.route("/getFitnessPlan", methods=["GET"])
@jwt_required()
def getFitnessPlan():
    """
    Retrieve the user's fitness plan if present

    This endpoint allows an authenticated user to retrieve their fitness plan

    ---
    tags:
      - Events
    security:
      - JWT: []
    responses:
      200:
        description: Successfully retrieved the user's fitness plan
        schema:
          type: object
          properties:
            fitness_plan:
              type: String
              description: String in the format of html to be rendered easily
            calories:
      401:
        description: Unauthorized. User must be logged in to retrieve their registered events.
      500:
        description: An error occurred while retrieving the user's info/in generating the fitness plan
    """
    try:
        current_user = get_jwt_identity()
        user_data = mongo.user.find_one({"email": current_user})

        if user_data and "fitness_plan" in user_data:
            fitness_plan = user_data["fitness_plan"]
            response = {
                "status": "Success",
                "fitness_plan": fitness_plan
            }
            statusCode = 200
        else:
            response = {
                "status": "Not Found",
                "message": "Fitness plan not found."
            }
            statusCode = 404
    except Exception as e:
        response = {"status": "Error", "message": str(e)}
        statusCode = 500
    
    return jsonify(response), statusCode

model= Ollama(model="llama3.2")

@api.route('/chatbot', methods=["POST"])
def chatbot():
    """
    Chatbot

    This endpoint allows the user to chat with the chatbot.

    ---
    tags:
      - Chatbot
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            message:
              type: string
              description: The message sent by the user.
    responses:
      200:
        description: Successfully retrieved the response from the chatbot.
        schema:
          type: object
          properties:
            response:
              type: string
              description: The response from the chatbot.
        example:
          {
            "response": "Hello! How can I help you today?"
          }
      500:
        description: An error occurred while processing the chatbot message.
    """
    data = request.get_json()
    question= data.get('question')
    answer = get_model_response(question)

    return jsonify({"answer": answer})

def get_model_response(question):
    attempts = 3
    for attempt in range(attempts):
        try:
            modified_prompt = "Answer concisely by default. " + question
            result = model.complete(modified_prompt)
            print(result) 

            if hasattr(result, 'text'):
                return result.text.strip()
            else:
                return str(result).strip()

        except requests.exceptions.Timeout:
            logging.error("Timeout error occurred. Retrying...")
            if attempt < attempts - 1:
                time.sleep(2)  
            else:
                return "Error: Request timed out. Please try again later."

        except requests.exceptions.ConnectionError:
            logging.error("Connection error occurred. Retrying...")
            if attempt < attempts - 1:
                time.sleep(2) 
            else:
                return "Error: Network issue. Please check your connection."

        except Exception as e:
            logging.error(f"An unexpected error occurred: {str(e)}")
            if attempt < attempts - 1:
                time.sleep(2)  
            else:
                return f"Error: {str(e)}"


# Added today

from datetime import datetime


@api.route('/track-weight', methods=['POST'])  # pragma: no cover
@jwt_required()
def track_weight():
    """
    Record weekly weight

    This endpoint allows an authenticated user to log their weight for a given week.

    ---
    tags:
      - Weight Tracker
    parameters:
      - in: body
        name: data
        description: Data containing the weight information
        required: true
        schema:
          type: object
          properties:
            weight:
              type: number
              description: The user's current weight
            week:
              type: string
              description: The week for which the weight is recorded (e.g., "2024-W47")
            targetWeight:
              type: number
              description: The user's target weight
        example:
          weight: 75.0
          week: "2024-W47"
          targetWeight: 70.0
    security:
      - JWT: []
    responses:
      200:
        description: Weight recorded successfully
        schema:
          type: object
          properties:
            status:
              type: string
              example: "Weight recorded successfully"
      500:
        description: An error occurred while recording the weight
    """
    data = request.get_json()  # Get data from POST request
    current_user = get_jwt_identity()
    try:
        # Insert or update weight tracking information
        mongo.weight_tracker.update_one(
            {
                "email": current_user,
                "week": data['week']
            },
            {
                "$set": {
                    "weight": data['weight'],
                    "targetWeight": data['targetWeight'],
                    "dateUpdated": datetime.utcnow()
                }
            },
            upsert=True
        )
        response = {"status": "Weight recorded successfully"}
    except Exception as e:
        response = {"status": "Error", "message": str(e)}

    return jsonify(response)


@api.route('/get-weight-tracker', methods=['GET'])  # pragma: no cover
@jwt_required()
def get_weight_tracker():
    """
    Retrieve weight tracking history

    This endpoint allows an authenticated user to retrieve their weekly weight tracking history.

    ---
    tags:
      - Weight Tracker
    responses:
      200:
        description: A list of weight tracking records
        schema:
          type: array
          items:
            type: object
            properties:
              week:
                type: string
              weight:
                type: number
              targetWeight:
                type: number
              progress:
                type: string
                description: Progress towards the target weight
      404:
        description: No weight records found
    """
    current_user = get_jwt_identity()
    weight_records = list(mongo.weight_tracker.find({"email": current_user}))
    if weight_records:
        for record in weight_records:
            record["_id"] = str(record["_id"])  # Convert ObjectId to string
            progress = round((record["weight"] - record["targetWeight"]), 2)
            record["progress"] = f"{progress} kg from target"
        return jsonify(weight_records)
    else:
        return jsonify({"message": "No weight records found"}), 404

