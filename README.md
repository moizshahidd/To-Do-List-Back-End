# Todo List Application - Backend

This repository contains the backend code for the Todo List web application. The backend is built with Node.js and connects to a Microsoft SQL Server (MSSQL) database.

## Requirements

- Node.js (v14 or higher)
- Microsoft SQL Server


### 1. Clone the Repository

Clone this repository to your local machine using:

```bash
git clone https://github.com/moizshahidd/To-Do-List-Back-End.git
```
### 2. Navigate to project directory: 
```bash
cd To-Do-List-Back-End
```

### 3. Install the dependencies:
```bash
npm install
```

### 4. Configure Database Connection

In the backend code, the database connection settings are configured within a class. You can modify these settings directly in the code.

In Database.js file is responsible for database connection in project. The connection configuration is set up as follows:

```javascript
class Database {
    constructor() {
        this.config = {
            user: 'UserName',
            password: 'Password',
            server: 'ServerName',
            database: 'DBname',
            options: {
                encrypt: false, // Set to true if using Azure
                trustServerCertificate: true // Set to true if you are using a self-signed certificate
            },
            port: 1433 // Default port for MSSQL
        };
    }
}
```
Replace 'UserName', 'Password', 'ServerName', and 'DBname' with your actual database credentials and details.

## Setup the Databse
In Database folder, there is file name script.sql.
Run the provided .sql script to create the necessary tables in your MSSQL database. You can execute this script using SQL Server Management Studio (SSMS) or any other SQL client that supports MSSQL.

### Start the server
```bash
node app.js
```

