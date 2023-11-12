# be-freestroke

## Hosted Version: https://freestroke-api.onrender.com/api

### Freestroke - Safe Outdoor Swimming Location API Guide

## Project Overview:

This component is a segment of a more extensive project where we are developing a comprehensive application for a Safe Outdoor Swimming Location App. The backend of this project utilizes a Restful API and is supported by a MongoDB database, interfaced through mongosh. With the provided API endpoints, users can perform a variety of actions, including viewing and posting locations, as well as reviews. Users will also be able to vote on each review. Locations can be sorted in ascending / descending order based on distance away from user. For a detailed list of available API endpoints, refer to the endpoints.json file.

### Tech Stack:

- JavaScript
- Express
- MongoDB
- Node.js
- Jest

## Setup Instructions:

### 1. Clone repo

```
git clone https://github.com/merongb/be-freestroke
```

### 2. Create a .env.test file

```
.env.test
```

> Inside should have the following `MONGO_URL=mongodb://localhost:27017/test-database`

### 3. Install required dependencies

```
npm install
```

### 4. Seed the Data to local Database

```
'npm run seed'
```

> `For test data`

```
'npm run test'
```

> `For test data`

### 5. Connect to local Database

1. ```
   Mongosh
   ```
2. ```
   use test-database
   ```

## Version requirements

```
Node v18.17.1
MongoDB: 7.0.2 or higher
```

Group: Team300
