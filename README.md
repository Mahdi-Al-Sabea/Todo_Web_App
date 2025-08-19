# 🚀 Todo Web Application
This application allows users to add Todo items, mark items as
done, delete items, and toggle between completed/non-completed tasks.

## 🔧 Getting Started
These are the steps needed to get the project running locally.

Prerequisites: 

Docker (can work without it but its recommended for running the application without setup [no need for db and node to be installed])

Node.js (v18.x or later) [if docker is not used]

MongoDb [if docker is not used]


Installation & Setup: A step-by-step guide to setting up the development environment.

Clone the repository:

```Bash
git clone https://github.com/Mahdi-Al-Sabea/Todo_Web_App.git
cd Todo_Web_App
```

Environment Variables:.

Create a .env file in the root directory and copy the contents from below.

Bash
MONGO_URI=mongodb://myUser:myPassword@localhost:27017/?authSource=admin
JWT_SECRET=mySuperSecretKey
MONGO_ADMIN_USER=myAdminUser
MONGO_ADMIN_PASS=myAdminPassword


## ▶️ Running the Application

### way 1 (recommended) : Using docker compose

Make sure you have docker running on your local machine

Using a terminal open in the root directory of the project run the command below

```Bash
docker compose up
```

The previous command will execute the docker compose file that will run the application using docker containers under a private network , you can communicate with db and application through exposed ports.


### way 2 : Without using docker compose

Make sure you have Node.js installed on your local machine and you have a mongodb instance running

Using a terminal open in the root directory of the project run the commands below

```Bash
npm install
npm run dev
```

The application will run locally and will connect to the locally running mongodb db instance.


While the application is running you can interact with the application on http://localhost:4000 using any client (apollo explorer,postman etc...)



## API Documentations

| Operation    | Type      | Description                          | Auth Required |
|--------------|-----------|--------------------------------------|---------------|
| `signUp`     | Mutation  | Register a new user                  | ❌ No          |
| `signin`      | Mutation  | Authenticate a user and return token | ❌ No          |
| `getMyUser`         | Query     | Get current user profile             | ✅ Yes         |
| `myTodos` | Query  | Get all todo tasks for current user                    | ✅ Yes         |
| `addTodo`   | Mutation     | Create a new todo task for current user                      | ✅ Yes          |
| `toggleTodo` | Mutation  | Toggle between complete/uncompleted for a certain todo task for current user                  | ✅ Yes         |
| `deleteTodo` | Mutation  | Delete a todo task for current user                  | ✅ Yes         |



## 🛠️ Technology Stack
A list of the major frameworks, libraries, and tools used in the project.

Framework: TypeGraphQL

Database: MongoDb with mongoose ORM

Authentication: JSON Web Tokens (JWT)

Validation: class-validator




