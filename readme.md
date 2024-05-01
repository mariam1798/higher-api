# Higher

**How to Download and Launch the Application**

1. Clone Repositories

- Clone the GitHub repositories for both the client and server components of Higher:
- Client: git clone <client_repository_url>
- Server: git clone <server_repository_url>

2. Install Dependencies

- Navigate into each cloned repository directory (client and server) and install NPM packages:

**npm install**

3. Set Up Database

- Create a database in MySQL for the Higher application.
- In the server directory, run database migrations and seed data:
  **npx knex migrate:latest**
  **npx knex seed:run**

4. Configure Cloudinary Credentials

- Sign up for a Cloudinary account if you haven't already.
- Obtain your Cloudinary credentials (Cloud Name, API Key, and API Secret).
- In both the client and server directories, create a .env file using the provided .env.example file as a guide. Add your Cloudinary credentials to the server .env file:

  **CLOUD_NAME=your_cloud_name**
  ** API_KEY=your_api_key**
  **API_SECRET=your_api_secret**

5. Set Up Multer Uploads

- In the server directory, create an uploads folder inside the public directory:

6. Launch the Application

- Start the client and server components:
  **npm start**

7. Access the Application

- Once both components are running, you can access the Higher application in your web browser.

## Overview

Higher is a pioneering platform that reimagines the traditional job application process by blending the professional networking capabilities of LinkedIn with the dynamic, video-based engagement of TikTok. By enabling users to express their skills, experiences, and personalities through video content, Higher aims to foster more authentic connections between job seekers and employers, streamline the hiring process, and provide greater visibility for underrepresented talents.

### Problem

The current job application landscape often relies heavily on textual resumes and cover letters, which may not fully capture an individual's personality, soft skills, or potential. This can lead to a lengthy and sometimes biased hiring process, disadvantaging especially junior candidates who may not have extensive experience or those from diverse backgrounds. #Higher addresses these challenges by offering a platform for users to showcase their professional selves in a more holistic and engaging manner through video presentations.

### User Profile

Higher is designed for a broad user base, including but not limited to, job seekers across various industries and career stages, as well as companies ranging from startups to large corporations seeking to diversify their hiring methods. The platform will cater especially to individuals who thrive in presenting themselves visually and verbally, and to employers looking to streamline their hiring process while gaining deeper insights into potential candidates.

### Features

-Video CV Uploads: as a User I can create and upload short video presentations to highlight my skills, experiences, and personalities.
-Video Sharing & Networking: As a user, I can share my videos within the platform, fostering professional networking and visibility.

- Job Recommendations: Users receive job recommendations based on their job titles and locations.
- Job Search Functionality: Users can search for jobs directly on the platform.

## Implementation

### Tech Stack

- React
- MySQL
- Express
- Client libraries:
  - react
  - react-router
  - axios
  - dotenv
  - framer-motion
  - react-dom
  - react-modal
  - react-router-dom
  - react-select
  - react-select-country-list
  - react-toastify
  - sass
  - uuid
- Server libraries:
  - knex
  - express
  - bcrypt for password hashing
  - Multer
  - dotenv
  - cors
  - jsonwebtoken

### APIs

- Jsearch API: Utilized for fetching job listings.

### Sitemap

- Home page
- user Page
- job Page
- Register Page
- Login Page
- Users Page

### Data

![](/src/assets/images/mysql.png)

### Endpoints

GET /profile
Fetch the authenticated user's profile details.
Headers:

Authorization: Bearer token
Response:

{
"id": 1,
"name": "John Doe",
"email": "john@example.com",
"location": "New York, USA",
"professional_status": "Employed",
"experience_years": "5",
"job_title": "Software Engineer",
"avatar": "/path/to/avatar.jpg"
}

GET /:userId/videos
Retrieve all videos uploaded by a specific user.
Parameters:

userId: ID of the user whose videos are being requested.
Response:

[
{
"id": 2,
"user_id": 1,
"title": "My First Video",
"link": "http://example.com/video.mp4"
}
]

GET /:userId
Fetch details of a specific user by their ID.
Parameters:

userId: ID of the user to retrieve.
Response:

{
"id": 1,
"name": "John Doe",
"email": "john@example.com",
"location": "New York, USA",
"professional_status": "Employed",
"experience_years": "5",
"job_title": "Software Engineer",
"avatar": "/path/to/avatar.jpg"
}

GET /
Retrieve a list of all users in the system.
Response:

[
{
"id": 1,
"name": "John Doe",
"email": "john@example.com",
"location": "New York, USA",
"professional_status": "Employed",
"experience_years": "5",
"job_title": "Software Engineer",
"avatar": "/path/to/avatar.jpg"
}
]

POST /users/register
Add a new user account to the system.
Parameters:

name: User's full name.
email: User's email address.
password: User's chosen password.
location: User's city and country.
professional_status: Employment status (e.g., employed, student).
experience_years: Years of experience in the current role.
job_title: Current job title.
avatar: A file path indicating where the user's avatar image is stored.
Response:

{
"name": "Jane Doe",
"email": "jane@example.com",
"password": "hashed_password",
"professional_status": "Student",
"experience_years": "2",
"location": "San Francisco, USA",
"job_title": "Intern",
"avatar": "/uploads/avatar.jpg"
}

POST /users/login
Authenticate a user and provide a JWT token for session management.
Parameters:

email: User's email.
password: User's password.
Response:

{
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6I..."
}

POST /videos/
Upload a video: Allows authenticated users to upload a video file along with details about the video.
Parameters:

file (file): Video file to upload.
title (string): Title of the video.
description (string): Description of the video content.
Request Headers:

Authorization: Bearer token to authenticate the user.
Response:

json
Copy code
{
"message": "video uploaded successfully"
}
Errors:

401 Unauthorized: No token provided or authentication failed.
404 Not Found: User not found.
500 Server Error: Issues during file upload or database insertion.
GET /videos/
Retrieve all videos: Fetches a list of all videos stored in the database.
Response:

json
Copy code
[
{
"id": 1,
"title": "Introduction to Node.js",
"description": "A beginner's guide to Node.js",
"url": "/uploads/video.mp4",
"timestamp": 1609459200000,
"user_id": 1,
"channel": "John Doe",
"avatar": "/path/to/avatar.jpg"
}
]
Errors:

500 Server Error: Failed to fetch videos from the database.
PATCH /videos/:videoId
Edit video: Increment the likes count for a video specified by its ID.
Parameters:

videoId (integer): ID of the video to be updated.
Response:

json
Copy code
{
"id": 1,
"title": "Introduction to Node.js",
"description": "A beginner's guide to Node.js",
"likes": 1, // Incremented like count
"url": "/uploads/video.mp4",
"timestamp": 1609459200000,
"user_id": 1,
"channel": "John Doe",
"avatar": "/path/to/avatar.jpg"
}
Errors:

401 Unauthorized: Invalid or missing video ID.
500 Server Error: Error updating video in the database.

### Auth

- JWT auth
- Use useContext for handling authentication.
- Store JWT in localStorage, remove when a user logs out

## Nice-to-haves

1- AI Integration for Content Suggestions
Utilize AI to provide users with suggested topics for creating new videos.

2- AI-Driven Interview Question Suggestions
Implement AI to offer users suggested interview questions for practice.

3- writing comments and editing profile.

3- Video-Based Job Applications: As a user I can apply to posted positions with my video CVs, allowin employers to gain a comprehensive view of candidates beyond the resume.

``

```

```
