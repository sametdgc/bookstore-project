# Bookstore Project - Backend

This is the backend for the Bookstore project, built with FastAPI. It provides API endpoints for managing books, users, orders, and more.
If you cloned the repository adn you are in the bookstore-project folder, cd into backend with: cd backend
We need to create a python virtual environment to run the backend, you may need to run your terminal as administrator 

## Prerequisites

- Python 3.8+
- Virtual Environment (`venv`)

## Setup Instructions

1. **Create a Virtual Environment**:
python -m venv venv
venv\Scripts\activate  # For Windows
# On MacOS/Linux: source venv/bin/activate

2. **Install backend dependencies**:
pip install -r requirements.txt

(in this requirements.txt file current dependencies are already set, just run the above code in your terminal and that is it)

3. **.env file setup (for later on)**:
.env file is where we store our environment variables like database URL, secret key, etc. The .env files are not committed to the repository, 
since it is added to the .gitignore file. We might create our local .env files and work on it locally:

I will share what to add in the .env file

4. **run the backend server**:
uvicorn app.main:app --reload


## Quick Guide for Running the Backend After Initial Setup
Once the virtual environment is created and dependencies are installed, follow these steps to run the backend server each time:

1. **Activate the Virtual Environment**:
   - On **Windows**:
     ```bash
     venv\Scripts\activate
     ```
   - On **macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```

2. **Run the Backend Server**:
   ```bash
   uvicorn app.main:app --reload