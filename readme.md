# QuoteNote

## Prerequisites

>#### Project requires Nodejs and PostgreSQL installed on your system.
>##### [PostgreSQL installer](https://www.postgresql.org/download/)
>##### [Node.js:n asennus, which includes npm](https://nodejs.org/en/download/)

## Installation
#

### 1. Create new PostgreSQL database and import either the "quotenote_empty.sql" or "quotenote_with_test_data.sql" into the database.
#

### 3. Run 'npm install' both in client-folder and server-folder.
#

### 4. In server-folder, copy .env.example and rename it as .env
#

### 5. Fill the required information in .env-file.
>##### DATABASE_URL = [postgresql-database connetion url]
>##### APP_PORT = 3001
>##### ACCESS_TOKEN_SECRET = [any random string]
>##### REGISTRATION_SECRET = [any random string]
#

### 6. Disable the email verification option (or apply suitable information to .env-file): 
>#### server > controllers > userController.js **comment row 57**
>#### server > models > userModel.js **change row 29 'false' --> 'true'**
#

#
### 8. Start the program
####  Run 'npm start' both in client-folder and server-folder.
