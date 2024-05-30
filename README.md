# Movie Library Web Application

This is a movie library web application built with a MERN stack, allowing users to search for movies, create lists of movies, and manage their lists. Users can also choose to make their lists either public or private.

## Features

- User authentication (Sign In/Sign Up)
- Search for movies using the TMDB API
- Create and manage lists of movies
- Public and private list options

## Tech Stack

- **Frontend**:
  - React.js
  - React Router
  - Styled Components
  - Axios
  
- **Backend**:
  - Node.js with Express.js
  - MongoDB
  - JWT (JSON Web Tokens)
  - TMDB API

## Running the Code

### Backend Setup

1. Clone the repository:
```bash
git clone <repository_url>
```
2. Navigate to the project directory:
```bash
cd <project_directory>
Replace <project_directory> with the name of the directory where the project was cloned.
```
3. Set up the backend:
   a. Navigate to the server directory:
   ```bash
   cd server
   ```
   b. Install backend dependencies:
   ```bash
   npm install
   ```
   c. Set up environment variables:
   Create a .env file in the server directory and define the following variables:
   ```bash
   MONGODB_URL=your_mongodb_connection_url
   PORT=5000
   TOKEN_SECRET=your_token_secret
   TMDB_BASE_URL=https://api.themoviedb.org/3
   TMDB_KEY=your_tmdb_api_key
   ```
   Replace your_mongodb_connection_url, your_token_secret, and your_tmdb_api_key with your actual MongoDB connection URL, token secret, and TMDB API key respectively.

   d. Run the backend server:
   ```bash
   npm start
   ``` 

### Frontend Setup

1.Navigate to the client directory:
```bash
cd ../client
```
2. Install frontend dependencies:
```bash
npm install
``` 
3. Run the frontend development server:
```bash
npm start
```
4. Open your browser and navigate to http://localhost:3000 to access the application.

# Live URL -> https://movie-library-flame.vercel.app/

## Notes
Make sure to obtain API keys for TMDB API and set up MongoDB database properly.
For security reasons, do not expose sensitive information such as API keys or secret keys in your code repository.
   
