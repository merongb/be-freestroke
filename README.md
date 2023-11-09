# be-freestroke

Freestroke - Safe Outdoor Swimming Location API Guide
Developers, take note: To establish a connection with the databases, you must set up two environment (.env) files. The first is for the test database, and the second for the primary development database. Within these files, input "MONGO_URL=" followed by the respective database name. Once set up, ensure proper linkage with dotenv.

Cloud Application Link:
https://freestroke-api.onrender.com/api

Project Overview:
This component is a segment of a more extensive project where we are developing a comprehensive application for a Safe Outdoor Swimming Location App. The backend of this project utilizes a Restful API and is supported by a MongoDB database, interfaced through mongosh. With the provided API endpoints, users can perform a variety of actions, including viewing and posting locations, as well as reviews. Users will also be able to vote on each review. Locations can be sorted in ascending / descending order based on distance away from user. For a detailed list of available API endpoints, refer to the endpoints.json file.

Tech Stack:

JavaScript
Express
MongoDB
Node.js
Jest
Husky
SuperTest
Setup Instructions:

Fork the Repository: Navigate to the public be-freestroke project repository on our GitHub and click on the fork button.

Clone Your Fork: Post-forking, you'll find the project in your GitHub repositories with your username prefixed to the repo name. Copy the URL.

Clone to Local: In your terminal, use the command git clone [your-forked-repo-link].

Authentication: If prompted, enter your GitHub credentials. For the password, use a personal access token, available in your GitHub settings.

Local Setup: After cloning, open the project in your code editor.

Install Dependencies: Within the project directory in your terminal, run npm install.

Seed the Database: Execute npm run setup-dbs followed by npm run seed to populate the database with sample data.

View the Database: Use mongosh in the terminal, followed by desired MongoDB commands to select the required database.

Run Tests: Input npm t to execute the project tests.

Version Requirements:

Node: v20.2.0 or higher
MongoDB: 7.0.2 or higher

Group: Team300