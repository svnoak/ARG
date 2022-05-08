# API DOCUMENTATION

There are different API endpoints that can be used to get data from the database. Following are the endpoints and their response codes and what data they return as well as some example code.

If the request method is not correct, the endpoint will return "Bad Request" with the response code 400.

<aside>
💡 The API for VARG lives at https://dev.svnoak.net/api

</aside>

<aside>
💡 All responses from the database are sent as JSON

</aside>

&NewLine;  
&NewLine;  

## Email

---
  

```
/email
```

<details>
<summary>Example request</summary>

```jsx
const request = new Request(`https://dev.svnoak.net/api/email/`);

fetch(request ,{
    method: 'GET',
})
```

</details>

Usage: For getting all the emails in the first playscreen.

Request Method: GET

Returns: Array with all emails

Response: 200

<details>
<summary>Example respone</summary>
    
```jsx
[
    {
        "email_id": "2",
        "firstName": "Peter",
        "lastName": "Holmquist",
        "subject": "Imorgon",
        "body": "<p>Hej du! Glöm inte att vi skulle ses vid lunch lite senare, vet att du kan glömma när du får nya spännande grejer för dig.  ;P Vad sägs om Surf shack?<\/p>",
        "date": "-1",
        "time": "11:24:00",
        "read": "1",
        "address": "peter-holmquist@gmail.com"
    }
]
```

</details>

&NewLine;  
&NewLine;  

## User

---
 
```
/user/create
```

Usage: When creating the user in the first playscreen after they have choosen a username.

Request Method: POST

Body: username (string), password (6 integers)

<details>
<summary>Example response</summary>
    
    
```jsx
const request = new Request(`https://dev.svnoak.net/api/user/create/`);
const data = {
    username: "Foo",
    password: 123456
}

fetch(request ,{
    method: 'POST',
    headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
```
    
</details>

***<span style="color: green">Success</span>***

Returns: Id of created user

Response: 201

<details>
<summary>Example response</summary>
    

```jsx
{
"id": "18",
"name": "Foo"
}
```
</details>
    

***<span style="color: red">Error</span>***

Reason: Username already exists in database.

Returns: "User already exists"

Response: 409

<details>
<summary>Example response</summary>
    
```jsx
"User already exists"
```
    
</details>


&NewLine;  
&NewLine;  

---
```
/user/login
```
Usage: When no userdata is available in localstorage.

Request Method: POST

Body: username (string), password (6 integers)

<details>
<summary>Example request</summary>

    
```jsx
const request = new Request(`https://dev.svnoak.net/api/user/login/`);
const data = {
    username: "Foo",
    password: 123456
}

fetch(request ,{
    method: 'POST',
    headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
```
    
</details>

***<span style="color: green">Success</span>***

Returns: UserID

Response: 200

<details>
<summary>Example response</summary>

    
```jsx
{
"id": "18",
"name": "Foo"
}
```

</details>
    
***<span style="color: red">Error</span>***

This occurs when username or password is missing in the POST body, or if no username/password match is found in the database.

Returns: “Wrong username or password”

Response: 401

## Places and Dialogs

---

```
/place/get/{placeID}
```

Usage: When user comes near a place with matching geolocation.

Request Method: GET

<details>
<summary>Example request</summary>

    
```jsx
const placeID = 1;
const request = new Request(`https://dev.svnoak.net/api/place/${placeID}`);

fetch(request ,{
    method: 'GET',
})
```
    
</details>

***<span style="color: green">Success</span>***

Returns: Place object

Response: 200

<details>
<summary>Example response</summary>

    
```jsx
{
    "id": "1",
    "name": "Gamla Väster",
    "longitude": "12.997648",
    "latitude": "55.606679",
    "infoText": null,
    "area": "10",
    "npc": "2",
    "imageLink": null
}
```

</details>

---

&NewLine;  
&NewLine;  

```
/place/{placeID}/{userID}
```

Usage: When user comes near a place with matching geolocation.

Request Method: GET

<details>
<summary>Example request</summary>

    
```jsx
const placeID = 1;
const userID = 18;
const request = new Request(`https://dev.svnoak.net/api/place/${placeID}/${userID}`);

fetch(request ,{
    method: 'GET',
})
```

</details>    

***<span style="color: green">Success</span>***

Returns: NPC, Dialog and Place data for the specific place as objects.

Response: 200

<aside>
💡 The response is an object containing “place”, “npc” and “dialog”.
Place and NPC have static information about the place.

Dialog contains dialogs and puzzles in the specific order the player is to see them.
The last dialog option contains the attributes “markDone: true” and “id”.
Use this to mark the dialog with the appropriate ID as done.

Dialogs can also contain audio with the appropriate link to the file.

Puzzles don’t contain the answers. Use the /dialog/done endpoint to check the user-submitted solution.

</aside>

<details>
<summary>Example response</summary>
    
```jsx
{
    "place": {
        "id": "1",
        "name": "Gamla Väster",
        "longitude": "12.997648",
        "latitude": "55.606679",
        "infoText": null,
        "area": "10",
        "npc": "2",
        "imageLink": null
    },
    "npc": {
        "id": "2",
        "name": "Bäckahästen",
        "imageLink": "link",
        "infoText": null
    },
    "dialog": [
        {
            "text": "Det kommer fram en häst galopperande med sina hovar. Ju närmare den kommer desto mer ser du hur det droppar om vatten vart den än går.",
            "type": "info",
            "speaker": "",
            "audio": "link to audio file"
        },
        {
            "text": "Välkommen människa. Står du och beundrar min skönhet?",
            "type": "dialog",
            "speaker": "Bäckahästen",
            "audio": "link to audio file"
        },
        {
            "text": "Absolut. På tal om din skönhet, ville jag faktiskt också fråga dig om all vatten som följer efter dig.",
            "type": "dialog",
            "speaker": "player"
        },
        {
            "text": "Jaha! Har du hört historien bakom dessa kvarter?",
            "type": "dialog",
            "speaker": "Bäckahästen",
            "audio": "link to audio file"
        },
        {
            "text": "Inte riktigt.",
            "type": "dialog",
            "speaker": "player"
        },
        {
            "text": "Under de gamla goda dar var detta en mittpunkt för sjömän att samla sig vid. Det var även ett badhus här i närheten… det var så roligt då.",
            "type": "dialog",
            "speaker": "Bäckahästen",
            "audio": "link to audio file"
        },
        {
            "text": "Är det inte roligt nu längre?",
            "type": "dialog",
            "speaker": "player"
        },
        {
            "text": "Inte som det var förr ska du veta!",
            "type": "dialog",
            "speaker": "Bäckahästen",
            "audio": "link to audio file"
        },
        {
            "text": "Skulle jag kunna få med mig lite av ditt vatten?",
            "type": "dialog",
            "speaker": "player"
        },
        {
            "text": "Om du löser denna gåtan kan du få med dig en del av mitt underbara vatten. Om inte så kan jag visa dig hur vi hade roligt förr i tiden!",
            "type": "dialog",
            "speaker": "Bäckahästen",
            "audio": "link to audio file",
            "markDone": true,
            "id": "1"
        },
        {
            "type": "puzzle",
            "text": "Detta är min fråga!",
            "tips": [
                "Tips 1",
                " Tips 2",
                "Tips 3"
            ],
            "id": "2"
        },
        {
            "type": "puzzle",
            "text": "Hästen slår med hovarna i takt: .-. .-.- -.- -. .- \/ .-. .. -. --. .- .-. -. .- \/ .--. .--.- \/ ...- .- - - -. . -",
            "tips": [
                "Tips vatten 1",
                "Tips vatten 2",
                "Tips vatten 3"
            ],
            "audio": "link to audio file",
            "id": "3"
        }
    ]
}
```
    
</details>

---

```
/dialog/done
```

Usage: When user has finished the last dialog or solved a puzzle.

Request Method: POST

Body: dialog (dialogID), user (userID), place (placeID), answer (puzzle answer)

<aside>
💡 The answer attribute needs always be defined as key, if there is no user answer, just leave it empty.

</aside>

<details>
<summary>Example request</summary>
    
    
```jsx
const request = new Request(`https://dev.svnoak.net/api/dialog/done`);
const data = {
    dialog: 1,
    user: 18,
    place: 1,
    answer: ""
}

fetch(request ,{
    method: 'POST',
    headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
```

</details>
    

***<span style="color: green">Success</span>***

Returns: Array of objects

Response: 200

<details>
<summary>Example response</summary>
    
```jsx
[
	{
		"id": "1",
		"jsonLink": "intro.json",
		"reward": null,
		"order": "1",
		"type": "chat",
		"place": null,
		"tips": "0"
	},
	{
		"id": "3",
		"jsonLink": "intro_1.json",
		"reward": "2",
		"order": "3",
		"type": "chat",
		"place": null,
		"tips": "0"
	},
	{
		"id": "6",
		"jsonLink": "backahast.json",
		"reward": "4",
		"order": "6",
		"type": "chat",
		"place": "1",
		"tips": "0"
	},
	{
		"id": "8",
		"jsonLink": "gardstomte.json",
		"reward": "6",
		"order": "8",
		"type": "chat",
		"place": "2",
		"tips": "0"
	}
]
```
    
</details>

___

```
/dialog/done
```

Usage: When user has finished the last dialog or solved a puzzle.

Request Method: POST

Body: dialog (dialogID), user (userID), place (placeID), answer (puzzle answer)

<aside>
💡 The answer attribute needs always be defined as key, if there is no user answer, just leave it empty.

</aside>

<details>
<summary>Example request</summary>
    
    
```jsx
const request = new Request(`https://dev.svnoak.net/api/dialog/done`);
const data = {
    dialog: 1,
    user: 18,
    place: 1,
    answer: ""
}

fetch(request ,{
    method: 'POST',
    headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
```

</details>
    

***<span style="color: green">Success</span>***

Returns: true or false

Response: 200

<aside>
💡 This endpoint includes a check for if the given answer for a puzzle is correct and returns false if it is not.

</aside>

## Inventory

---

### **/inventory/place/{userID}**

Usage: When user opens places in inventory

Request Method: GET

<details>
<summary>Example request</summary>
    
```jsx
const userID = 18;
const request = new Request(`https://dev.svnoak.net/api/inventory/place/${userID}`);

fetch(request ,{
    method: 'GET',
})
```
    
</details>

***<span style="color: green">Success</span>***

Returns: Place objects as array, returns empty array if player hasn’t been to any places yet.

Response: 200

<details>
<summary>Example response</summary>
    
```jsx
[
    {
        "id": "1",
        "name": "Name of place",
        "longitude": "coordinate",
        "latitude": "coordinate",
        "infoText": null,
        "area": "distance to coordinates",
        "npc": "2",
        "imageLink": null
    },
    {
        "id": "2",
        "name": "Name of place",
        "longitude": "coordinate",
        "latitude": "coordinate",
        "infoText": null,
        "area": "distance to coordinates",
        "npc": "3",
        "imageLink": null
    }
]
```

</details>

---

```
/inventory/npc/{userID}
```

Usage: When user opens npcs in inventory

Request Method: GET

<details>
<summary>Example response</summary>

```jsx
    const userID = 18;
    const request = new Request(`https://dev.svnoak.net/api/inventory/npc/${userID}`);
    fetch(request ,{
        method: 'GET',
    })
```
</details>


### <span style="color: green">Success</span>

Returns: NPC objects as array

Response: 200

<details>
<summary>Example response</summary>

```jsx
[
    {
        "id": "2",
        "name": "Name of NPC",
        "imageLink": "link",
        "infoText": null
    }
]
```

</details>

---

```
/inventory/item/{userID}
```

Usage: When user opens items in inventory

Request Method: GET

<details>
<summary>Example request</summary>

```jsx
const userID = 18;
const request = new Request(`https://dev.svnoak.net/api/inventory/item/${userID}`);

fetch(request ,{
    method: 'GET',
})
```

</details>

***<span style="color: green">Success</span>***

Returns: Items objects as array
Response: 200

<details>
<summary>Example request</summary>
    
```jsx
[
    {
        "id": "1",
        "name": "Name of item",
        "imageLink": "link",
        "infoText": null
    }
]
```

</details>
