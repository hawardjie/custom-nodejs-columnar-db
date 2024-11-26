# Goal: Create an Investment application implemented using customized columnar database.

1. Clone the repository.
2. Install the required dependency.
3. Run the application.

## Step 1: Clone the repository

Clone the repository **custom-nodejs-columnar-db** from GitHub:

```bash
git clone https://github.com/hawardjie/custom-nodejs-columnar-db.git
cd custom-nodejs-columnar-db
```

## Step 2: Install the required dependency

Install the module **uuid** dependency for generating unique identifiers for the id columns.

```javascript
npm install uuid
```

## Step 3: Run the application

```javascript
node app.js
```

## Examples:

Insert a new record

```
POST http://localhost:3000/api/table/investors/create
Content-Type: application/json

Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "status": "Active"
}

Response:
{
    "message": "Record created into table investors successfully"
}
```

Get all records

```
GET http://localhost:3000/api/table/investors

Response:
[
    {
        "investorId": "55b1717b-2e81-4b61-8d1f-bbce5c1657de",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "status": "Active",
        "createdAt": "2024-11-26T09:01:19.490Z"
    }
]
```

Get specific columns

```
GET http://localhost:3000/api/table/investors/columns?columns=firstName,lastName,status

Response:
[
    {
        "firstName": "John",
        "lastName": "Doe",
        "status": "Active"
    }
]
```
