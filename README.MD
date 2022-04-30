# VARG API

The API for VARG lives at dev.svnoak.net/api and can only be called with the appropriate authentication key.

## API Documentation

There are different api endpoints developers can use to get data from the database. Following are the endpoints and their response codes and what data they return.
If the request method is not correct, the endpoint will return "Bad Request" with the response code 400.

### /email

Request Method: GET
Returns: Array with all emails
Response: 200

### /user/create

Request Method: POST
Body: username (string), password (6 integers)

**Success**
Returns: Id of created user
Response: 201

**Error**
Reason: Username already exists in database.
Returns: "User already exists"
Response: 409

### /user/get

Request Method: POST
Body: username (string), password (6 integers)

**Success**
Returns: Userobject (id, username, password)
Response: 200

### /dialog

Request Method: GET

**Success**
Returns: Array of Objects with all dialog entries
Response: 200

### /dialog/{NPC ID}

Request Method: GET

**Success**
Returns: Array of Objects with all dialog entries for specific ID
Response: 200

Returns empty array if no dialogs are found.

### /npc

Request Method: GET

**Success**
Returns: Array of Objects with all npc entries
Response: 200

### /npc/{NPC ID}

Request Method: GET

**Success**
Returns: NPC Object
Response: 200

Returns empty Object if no NPC found in database.

### /item

Request Method: GET

**Success**
Returns: Array of Objects with all item entries
Response: 200

### /item/{Puzzle ID}

Request Method: GET

**Success**
Returns: Object for the item for the specific puzzle.
Response: 200

Returns empty Object if no NPC found in database.