# University Course Schedule Web Application

## Overview

This web application provides students with an intuitive interface to access and manage their class schedules. Developed using React.js for the frontend, Express.js for the backend, and PostgreSQL for the database, it offers a seamless experience for viewing and updating course information.

## Features

- **User Registration and Login**:
  - **Registration**: Users can create new accounts by providing necessary details, which are validated and stored in the database.
  - **Login**: Users can log in using their credentials. The system verifies the entered data against the records in the database, granting access upon successful authentication.

- **Class Schedule Display**:
  - Users can view class schedules for all three years of the bachelor's program. Data is dynamically loaded from the database through API calls, ensuring accuracy and up-to-date information.

- **University Links**:
  - Active links to the university's social media profiles and the official website are available in the footer of the website for easy access.

## Architecture

The project is structured into two main directories:

- **`backend/`**:
  - **`authDatabase.js`**: Configures the connection to the PostgreSQL database for authentication.
  - **`scheduleDatabase.js`**: Configures the connection to the PostgreSQL database for class schedules.
  - **`queries.js`**: Contains SQL queries for interacting with the databases.
  - **`server.js`**: Contains the server logic, including request handling and routing.

- **`frontend/`**:
  - **`public/`**: Contains static assets such as images and icons.
  - **`src/`**:
    - **`assets/`**: Contains files like logos and photographs.
    - **`features/`**: Contains Redux slices (`authSlice` and `scheduleSlice`) for state management.
    - **`pages/`**: Contains all pages available for display in the application.
    - **`services/`**: Contains functions for making API requests to the backend.
    - **`ui/`**: Contains UI components such as buttons, headers, footers, and loaders.

## API Endpoints

- **Authentication**:
  - `POST /auth/login`: Logs in a user with provided credentials.
  - `POST /auth/signup`: Registers a new user with provided details.

- **Schedule**:
  - `GET /schedule/firstYear`: Retrieves the class schedule for the first year.
  - `GET /schedule/secondYear`: Retrieves the class schedule for the second year.
  - `GET /schedule/thirdYear`: Retrieves the class schedule for the third year.

- **Information**:
  - `GET /info`: Provides information about the website and contact details.

## Setup and Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/your-repository-name.git
   cd your-repository-name
