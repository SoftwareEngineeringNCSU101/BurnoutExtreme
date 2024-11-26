from flask import Flask
from flask_pymongo import PyMongo
from flask_mail import Mail
from flask_cors import CORS
import os
from dotenv import load_dotenv
load_dotenv()


class App:
    def __init__(self):
        self.app = Flask(__name__)
        CORS(self.app)
        self.app.secret_key = 'secret'
        self.app.config['MONGO_URI'] = os.getenv('MONGODB_URI')
        self.mongo = PyMongo(self.app)

        self.app.config['MAIL_SERVER'] = 'smtp.gmail.com'
        self.app.config['MAIL_PORT'] = 465
        self.app.config['MAIL_USE_SSL'] = True
        self.app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
        self.app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
        self.mail = Mail(self.app)