# VARG API

The API for VARG lives at dev.svnoak.net/api and can only be called with the appropriate authentication key.

## API Documentation

There are different api endpoints developers can use to get data from the database. Following are the endpoints and their response codes and what data they return.
If the request method is not correct, the endpoint will return "Bad Request" with the response code 400.

### /email

Usage: For getting all the emails in the first playscreen.

Request Method: GET
Returns: Array with all emails
Response: 200

### /user/create

Usage: When creating the user in the first playscreen after they have choosen a username.

Request Method: POST
Body: username (string), password (6 integers)

**Success**
Returns: Id of created user
Response: 201

**Error**
Reason: Username already exists in database.
Returns: "User already exists"
Response: 409

### /user/login

Usage: When no userdata is available in localstorage.

Request Method: POST
Body: username (string), password (6 integers)

**Success**
Returns: UserID
Response: 200

### /user/get

Request Method: POST
Body: id (int)

**Success**
Returns: Userobject (id, username, password, lastDialog)
Response: 200

### /place/get/{id}

Usage: When user comes near a place with matching geolocation.

Request Method: GET
Returns: Place object
Response: 200

### /place/{id}

Usage: When user comes near a place with matching geolocation.

Request Method: GET

**Success**
Returns: NPC, Dialog and Place data for the specific place
Response: 200

**IMPORTANT!**
The last dialog is marked with "markDone":true after which a dialog is to be marked as done.
All dialogs have a key "id" in their last dialog object for posting it to /dialog/done on completion.

### /dialog/done

Usage: When user has finished the last dialog or solved a puzzle.

Request Method: POST
Body: dialog (dialogID as int), user (userID as int), place (placeID as int), answer (puzzle answer as string)
IMPORTANT! answer needs always be defined as key, if there is no user answer, just leave it empty.

**Success**
Returns: true or false
Response: 200

IMPORTANT! dialog/done includes a check for if the given answer for a puzzle is correct and returns false if it is not.