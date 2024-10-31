import pymongo

# Connect to MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["test"]  # Replace with your database name
collection = db["events"]  # Replace with your collection name


cards = [
    {
        "title": "Yoga",
        "latitude": "35.7822",
        "longitude": "-78.6713",
        "imageUrl": "/assets/img/yoga.jpg",
        "description": "New to Yoga? You are at the right place! Learn easy yoga poses to build strength, flexibility and mental clarity.",
        "eventLocation": "Wellness and Recreation Center, NCSU, Raleigh, NC",
        "eventTime": "10:00 AM - 11:30 AM",
        "eventDate": "October 15, 2023"
    },
    {
        "title": "Swimming",
        "latitude": "35.7822",
        "longitude": "-78.6713",
        "imageUrl": "/assets/img/swim.jpeg",
        "description": "Swimming is an activity that burns lots of calories, is easy on the joints, supports your weight...",
        "eventLocation": "Carmichael Aquatics Center, NCSU, Raleigh, NC",
        "eventTime": "11:30 AM - 12:30 PM",
        "eventDate": "November 20, 2023"
    },
    {
        "title": "Abs Smash",
        "latitude": "35.7822",
        "longitude": "-78.6713",
        "imageUrl": "/assets/img/R31.jpg",
        "description": "Whether your goal is a six-pack or just a little more definition around your midsection...",
        "eventLocation": "Carmichael Gym Studio 1, NCSU, Raleigh, NC",
        "eventTime": "7:00 PM - 8:00 PM",
        "eventDate": "December 2, 2023"
    },
    {
        "title": "Walk Fitness",
        "latitude": "35.7822",
        "longitude": "-78.6713",
        "imageUrl": "/assets/img/walk.jpg",
        "description": "Join us to get the best of the walk workouts to burn more calories than a stroll around the park.",
        "eventLocation": "Pullen Park, near NCSU, Raleigh, NC",
        "eventTime": "5:30 AM - 6:30 AM",
        "eventDate": "October 30, 2023"
    },
    {
        "title": "Belly Burner",
        "latitude": "35.7822",
        "longitude": "-78.6713",
        "imageUrl": "/assets/img/R21.jpg",
        "description": "Join Sasha for a 30-minute no-equipment workout that will work on that stubborn belly fat.",
        "eventLocation": "Carmichael Gym Studio 2, NCSU, Raleigh, NC",
        "eventTime": "2:00 PM - 3:00 PM",
        "eventDate": "November 3, 2023"
    },
    {
        "title": "HRX Fitness",
        "latitude": "35.7822",
        "longitude": "-78.6713",
        "imageUrl": "/assets/img/R23.jpg",
        "description": "Shake it off and groove to some fun tracks with Tom and his squad in this dance fitness session!",
        "eventLocation": "Carmichael Gym, NCSU, Raleigh, NC",
        "eventTime": "8:00 AM - 9:00 AM",
        "eventDate": "November 12, 2023"
    },
    {
        "title": "Dance Fitness",
        "latitude": "35.7822",
        "longitude": "-78.6713",
        "imageUrl": "/assets/img/R22.jpg",
        "description": "It's time to push yourself to the limit! Join us for some intense workout sessions.",
        "eventLocation": "Carmichael Gym, NCSU, Raleigh, NC",
        "eventTime": "10:00 AM - 11:30 AM",
        "eventDate": "December 17, 2023"
    },
    {
        "title": "Core Conditioning",
        "latitude": "35.7822",
        "longitude": "-78.6713",
        "imageUrl": "/assets/img/R32.jpg",
        "description": "Develop core muscle strength that improves posture and contributes to a trimmer appearance.",
        "eventLocation": "Carmichael Gym, NCSU, Raleigh, NC",
        "eventTime": "5:00 PM - 6:15 PM",
        "eventDate": "December 19, 2023"
    },
    {
        "title": "Gym",
        "latitude": "35.7822",
        "longitude": "-78.6713",
        "imageUrl": "/assets/img/R11.jpg",
        "description": "A collection of Dumbbells workouts by skilled trainers specific to particular muscle groups.",
        "eventLocation": "Carmichael Gym, NCSU, Raleigh, NC",
        "eventTime": "11:00 AM - 1:00 PM",
        "eventDate": "October 23, 2023"
    }
]

# Insert data into MongoDB
collection.insert_many(cards)

print("Data inserted successfully!")
