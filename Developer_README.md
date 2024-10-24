<br />

<div  align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="https://github.com/aditikilledar/burnout-proj3/assets/52149707/77028411-c5e2-4c30-a200-992aa12be968" alt="Logo" width="120" height="120">
  </a>
  <h3 align="center">BURNOUT</h3>
  <p align="center">
    Your daily health companion 🏃‍♀️
    <br />
    <a href="https://aditikilledar.github.io/burnout-proj3/index.html"><strong>Explore the API docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/aditikilledar/burnout-proj3/blob/main/Tutorials.md">View Demo</a>
    ·
    <a href="https://github.com/aditikilledar/burnout-proj3/issues/new?assignees=&labels=&projects=&template=bug_report.md&title=">Report Bug</a>
    ·
    <a href="https://github.com/aditikilledar/burnout-proj3/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=">Request Feature</a>
    <br>
    <a href="https://youtu.be/bYTZT8vcICI">View Video</a>
    ·
    <a href="https://github.com/aditikilledar/burnout-proj3/blob/main/Project3Scores.md">Scores</a>
    ·
  </p>
</div>
<br>

[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/Naereen/StrapDown.js/blob/master/LICENSE)
[![DOI](https://zenodo.org/badge/714758791.svg)](https://zenodo.org/doi/10.5281/zenodo.10208054)
[![made-with-python](https://img.shields.io/badge/Made%20with-Python-1f425f.svg)](https://www.python.org/)
![Build Status](https://github.com/aditikilledar/burnout-proj3/actions/workflows/build_repo.yml/badge.svg)
[![PEP8](https://img.shields.io/badge/code%20style-pep8-orange.svg)](https://www.python.org/dev/peps/pep-0008/)
![last commit](https://img.shields.io/github/last-commit/aditikilledar/burnout-proj3)
![github workflow](https://github.com/aditikilledar/burnout-proj3/actions/workflows/unit_test.yml/badge.svg)
![github workflow](https://github.com/aditikilledar/burnout-proj3/actions/workflows/style_checker.yml/badge.svg)
![github workflow](https://github.com/aditikilledar/burnout-proj3/actions/workflows/syntax_checker.yml/badge.svg)
[![codecov](https://codecov.io/gh/aditikilledar/burnout-proj3/graph/badge.svg?token=8DO6VMEZ7J)](https://codecov.io/gh/aditikilledar/burnout-proj3)
<a href="https://github.com/aditikilledar/burnout-proj3/fork" target="blank">
<img src="https://img.shields.io/github/forks/aditikilledar/burnout-proj3?style=flat-square" alt="burnout-healthgoalsapp forks"/></a>
<a href="https://github.com/aditikilledar/burnout-proj3/stargazers" target="blank">
<img src="https://img.shields.io/github/stars/aditikilledar/burnout-proj3?style=flat-square" alt="burnout-healthgoalsapp stars"/>
<a href="https://github.com/aditikilledar/burnout-proj3/issues" target="blank"> <img src="https://img.shields.io/github/issues-closed/aditikilledar/burnout-proj3" alt="burnout-healthgoalsapp issues closed"/>
</a>
<a href="https://github.com/aditikilledar/burnout-proj3/graphs/contributors" alt="Contributors">
<img src="https://img.shields.io/github/contributors/aditikilledar/burnout-proj3" /></a>
<a href="https://github.com/aditikilledar/burnout-proj3/graphs/commit-activity" alt="commit activity">
<img src="https://img.shields.io/github/commit-activity/w/aditikilledar/burnout-proj3" /></a> 
<a href="https://github.com/aditikilledar/burnout-proj3/discussions" alt="discussion">
<img src="https://img.shields.io/github/discussions/aditikilledar/burnout-proj3" /></a> 
<a href="https://img.shields.io/github/repo-size/aditikilledar/burnout-proj3" alt="repo size">
<img src="https://img.shields.io/github/repo-size/aditikilledar/burnout-proj3" /></a>

# Developer Documentation

## Table of Contents  

- [Project Techstack:](#project-techstack)
- <a href="https://github.com/aditikilledar/burnout-proj3/blob/main/README.md#getting-started"> Get Started: Installation </a>
- [Technical Overview:](#technical-overview)
- [Third-Party Dependencies](#third-party-dependencies)
- [What's new?](#whats-new)
- [Contributors](#contributors)
- [Contribution](#contribution)
- [License](#license)

# Project TechStack

 <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="html" width="20" height="20"> React </br>
  -> <a href="https://mui.com/material-ui/">Material UI</a>
 <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg" alt="mongo" width="20" height="20"/> MongoDB </br>
 <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" alt="python" width="20" height="20"/> Python </br>

# Technical Overview

This application is a React-based web application that runs in the user's web browser. It provides the following key features:

- **User Authentication**: Upon logging in, the application creates and stores tokens locally on the user's machine to maintain user sessions securely.

- **Access Control**: Authenticated users have access to multiple pages and features within the application, ensuring a personalized and controlled user experience.

- **Backend Server**: The application relies on a Flask server to serve various user requests. The server interacts with a MongoDB database to fetch and store data as needed, ensuring smooth functionality and data persistence.

With these components working together, the application delivers a secure and feature-rich experience to its users.

 # Getting started
 
Follow these steps to set up and run the application on your local machine.

### Prerequisites
Before you begin, make sure you have the following installed:

- [Python](https://www.python.org/downloads/)
- [Node.js](https://nodejs.org/en/download)
- [MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows)
 
 Step 1: 
  Git Clone the Repository 
  
    git clone https://github.com/aditikilledar/burnout-proj3

Step 2:
   Ensure mongodb is running and execute the below to populate the tables:
   Navigate to the backend folder using "cd backend".

  Once in the backend, run:
  
    python insert_event_data.py
    python insert_food_data.py

 Step 3:
   Remain in the backend folder and run the following command to start the server:
    
    pip install -r requirements.txt
    flask run

 Step 4:
   Navigate to the frontend folder and run the below to start the React app:
    
    cd frontend
    npm install 
    npm start
    
 Step 5:
    Open the URL in your browser:  
      http://127.0.0.1:3000
      

## Third-Party Dependencies
  
  Frontend:

  | Package Name        | Version           | License  |
| ------------- |:-------------:| -----:|
| material-ui      | 4.12.4 | MIT License |
| axios      | 1.5.1      |   MIT License |
| chart.js | 1.1.1 | MIT License |
| dayjs | 1.11.10 | MIT License |
| react | 18.2.0 | MIT License |
| recharts | 2.8.0 | MIT License |
| web-vitals | 2.1.4 | Apache 2.0 License |
| react-toastify | 9.1.3 | MIT License |

  Backend:

   | Package Name        | Version           | License  |
| ------------- |:-------------:| -----:|
| Flask      | 2.2.5 | BSD 3-Clause |
| python_dotenv      | 0.21.1      |   BSD License (BSD-3-Clause) |
| flask_jwt_extended      | 4.5.3      |   MIT License |
| bcrypt      | 4.0.1      |   Apache License 2.0 |
| flask_pymongo      | 2.3.0    |   BSD License (BSD) |
| mongomock      | 4.1.2      |   BSD |
| flasgger      | 0.9.7.1      |   MIT License |
| coverage      | 7.2.7      |   Apache Software License (Apache-2.0) |

  
# What's new?

This version enhanced and built on the previous version, making it 10x more interesting and easier to use!
Here's what we added in this release.

1. Ability to add custom foods and track their calories.
2. Fully customizable meal creation.
3. An intuitive and searchable dropdown.
4. BMI Calculation for your personal profile.
5. Intelligent automatic calorie burn calculation.
6. Enhanced UI.
7. Randomized Exercise of the Day.
8. Google Sign-in is now an option!
9. Better progress tracking on the landing page.

## Bug Fixes
We fixed many bugs, but here are the most notable ones...

1. Sign up / Sign in issues, especially when an existing user tries to sign up again.
2. The proxy in the config files were wrong, making it difficult to run the website. Proxy issues were fixed.
3. Testcases were updated and fixed.
4. Event were not un-enrollable. Now events can be enrolled and unenrolled.
5. Exercise of the day was static, which defeats the purpose. Fixed, it is now random.
6. Linechart on the landing page was incorrect. Fixed.

:bulb: **Tip:** More enhancements/fixes can be found here : https://github.com/adi-kiran/burnout-healthgoalsapp/issues
   
   # Contributors
 <center>
  <table>
    <tr>
        <td align="center"><a href="https://github.com/aiyer786"><img src="https://avatars.githubusercontent.com/u/60314222?s=400&u=0984f88aeb3a9c30f4ec8145176134e626843fd5&v=4" width="100px;" alt=""/><br /><sub><b>Aditya Iyer</b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/aditikilledar"><img src="https://avatars.githubusercontent.com/u/73051765?v=4" width="100px;" alt=""/><br /><sub><b>Aditi Killedar</b></sub></a></td>
    <td align="center"><a href="https://github.com/shashank-madan"><img src="https://avatars.githubusercontent.com/u/52149707?s=80&v=4" width="100px;" alt=""/><br /><sub><b>Shashank Madan</b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/srina1h"><img src="https://avatars.githubusercontent.com/u/47570142?v=4" width="100px;" alt=""/><br /><sub><b>Srinath Srinivasan</b></sub></a><br /></td>
    </tr>
  </table>
</center>

  # Contribution
  
  Please refer the [CONTRIBUTING.md](https://github.com/adi-kiran/burnout-healthgoalsapp/blob/main/CONTRIBUTING.md) file for instructions on how to contribute to our repository.

  # License
  
  This project is licensed under the MIT License. Please refer to [LICENSE](https://github.com/adi-kiran/burnout-healthgoalsapp/blob/main/LICENSE) for more details.
  
  

