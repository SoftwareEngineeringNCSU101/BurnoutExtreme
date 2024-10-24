# Troubleshooting Guide

Welcome to the troubleshooting guide for BurnOut. If you encounter any issues while setting up or running the project, this document should help you diagnose and resolve common problems.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Common Issues](#common-issues)
3. [Getting Further Help](#getting-further-help)

## Prerequisites

Before troubleshooting, ensure:

1. You've followed installation/setup instructions in [README.md](./README.md).
2. Node.js and npm are installed for React.
3. MongoDB is running and accessible.
4. Flask environment is set up with necessary dependencies.

## Common Issues

### Issue 1: App doesn't start or throws errors during `npm start`

**Possible Causes:**
1. Missing `node_modules` after cloning the repository.
2. Incorrect environment variables.

**Solution:** 
1. Run `npm install` to install dependencies.
2. Ensure environment variables are correctly set.

### Issue 2: Components not rendering as expected

**Possible Causes:**
1. State management issues.
2. Missing or incorrect props.

**Solution:** 
1. Check the state and props being passed to components.
2. Use React Developer Tools for debugging.

### Issue 3: Database connection error

**Possible Causes:**
1. MongoDB server isn't running.
2. Connection string is incorrect.

**Solution:** 
1. Start MongoDB with `mongod`.
2. Verify connection string in the configuration.

### Issue 4: No events on Events Page

**Possible Causes:**
1. Targeted collection doesn't exist.
2. No data exists in events collection

**Solution:** 
1. Run the following commands to populate events collection:
   
      `cd BurnOut-HealthGoalsApp`
  
      `python insert_event_data.py`
2. Refresh Events Page. 

### Issue 5: Flask server doesn't start

**Possible Causes:**
1. Missing dependencies.
2. Port already in use.

**Solution:** 
1. Run `pip install -r requirements.txt` to ensure all packages are installed.
2. Try a different port or ensure no other processes are using the default port.

### Issue 6: API endpoints returning errors

**Possible Causes:**
1. Endpoints or routes are incorrectly defined.
2. Backend can't connect to MongoDB.

**Solution:** 
1. Verify route definitions and ensure methods (GET, POST, etc.) are correct.
2. Check the backend's MongoDB connection and settings.

## Getting Further Help

If you're still facing issues:

1. Check if the problem has been reported in the [Issues](https://github.com/adi-kiran/burnout-healthgoalsapp/issues) section.
2. If not listed, create a new issue with as much detail as possible.
3. For questions, refer to [Discussions](https://github.com/adi-kiran/burnout-healthgoalsapp/discussions).
