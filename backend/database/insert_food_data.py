import sys
import os

import importlib.util

# Specify the path to app.py
app_path = os.path.abspath(os.path.join(os.path.dirname(_file_), '..', 'app.py'))

# Load the app module
spec = importlib.util.spec_from_file_location("app", app_path)
app_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(app_module)

app = app_module.App()
mongo = app.mongo

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(_file_), '..', '..')))

file_path = os.path.join(os.path.dirname(_file_), 'food_data', 'calories.csv')

with open(file_path, 'r', encoding="ISO-8859-1") as f:
    l = f.readlines()

for i in range(1, len(l)):
    l[i] = l[i][1:len(l[i]) - 2]

for i in range(1, len(l)):
    temp = l[i].split(",")
    mongo.db.food.insert_one({'food': temp[0], 'calories': temp[1]})