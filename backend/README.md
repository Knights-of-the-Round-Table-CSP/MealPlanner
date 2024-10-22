# Meal Planner - backend

here goes backend that will run separately from UI

## Table of Contents

 - [Installation](#installation)
 - [Usage](#usage)

## Installation

1. **Clone the repository**
2. **Navigate to backend root folder**
   ```bash
   cd backend
3. **Set up a virtual environment**
   ```bash
   python3 -m venv env
4. **Activate the virtual environment**
   ```bash
   source env/bin/activate
5. **Install the required packages**
   ```bash
   pip install -r requirements.txt
6. **Create sqlite database**
   ```bash
   python manage.py migrate
7. **Create django superuser for admin/**
   ```bash
   python manage.py createsuperuser
then follow instructions

## Usage

 - To run the development server, use the following command:

   ```bash
   python manage.py runserver

 - If you make changes in models use the following command to make database changes

   ```bash
   python manage.py makemigrations
   ```
   ...before

   ```bash
   python manage.py migrate
   ```
   
 - Open [http://127.0.0.1:8000/](http://127.0.0.1:8000/) to see all endpoints.
 - Open [Django admin pannel](http://127.0.0.1:8000/admin) to handle users, use superuser credentials to login.
 - There is an anonymous access to [Register](http://127.0.0.1:8000/auth/register/) and [Login](http://127.0.0.1:8000/auth/login/) endpoints.
 - You can login from API interface, top right corner.
 - Another option for login is access_token that you receive from [Login](http://127.0.0.1:8000/auth/login/) endpoint. Try it with Postman or save it to localStorage in React later to add to HTTP headers "Authorization: Bearer {your_access_token}"
 - All endpoints accept JSON and return JSON with HTTP status code.
