# Laser Quest
This is the central server for a science project where we improve the Laser Quest experience.

## Installing and running
1. Clone from GitHub
2. Create a Firebase project, create a service account, make a new folder called `config` in this folder and put the JSON file for your service account's private key in there
3. Set up your `.env` file to match this format, replacing placeholders in angle brackets:
  ```
  MONGO_URL=mongodb://<YOUR_MONGO_URL>
  FIREBASE_CONFIG="var config = {apiKey: '<YOUR_FIREBASE_API_KEY', authDomain: '<YOUR_PROJECT_ID>.firebaseapp.com', databaseURL: 'https://<YOUR_PROJECT_ID>.firebaseio.com', storageBucket: '<YOUR_PROJECT_ID>.appspot.com', messagingSenderId: '<YOUR_MESSAGING_SENDER_ID>' };"
  MFA_KEY="-----BEGIN RSA PRIVATE KEY-----<A_2048_BIT_RSA_PRIVATE_KEY>-----END RSA PRIVATE KEY-----\n"
  FIREBASE_KEY="./config/<PATH_TO_YOUR_FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY>"
  FIREBASE_PUBLIC_KEY="<GO_TO_YOUR_CLIENT_CERT_URL_THEN_PASTE_THE_CERT_WITH_YOUR_PRIVATE_KEY_ID_FROM_YOUR_FIREBASE_SERVICE_ACCOUNT_FILE_HERE>"
  FIREBASE_DB_URL="https://<YOUR_PROJECT_ID>.firebaseio.com"
  ```
4. `npm install`
5. To set up your first user, `npm run setup` then follow the instructions in the console
6. To run the server, `npm start`. To use the API, you need to authenticate with the token shown after you sign in. It expires in an hour. To test just the public html pages, `npm run webserver`.

## API Documentation
All API routes are prefixed with `/api/v1`, for example to create a new user, you would send a POST request to `localhost:8080/api/v1/users`. All requests MUST be authenticated with a token signed with the Firebase private key. This token can be given as a `token` query parameter, `token` field or `x-access-token` header.

### POST /users
Creates a user
###### Fields:
  name (required): (String) The user's name

### GET /users
Returns a JSON list of all users

### GET /users/:user_id
Returns a User object

### PUT /users/:user_id
Updates the user's name to the contents of the name field
###### Fields:
  name (required): (String) The user's name

### DEL /users/:user_id
Deletes the user with the given id and removes them from any games they played

### GET /users/:user_id/games
Returns a JSON list of all games the user has been added to

### PUT /users/:user_id/games/:game_id
Add an existing user to an existing game

### DEL /users/:user_id/games/:game_id
Disassociate the user and the game. The user and the game will still exist.

### GET /users/:user_id/tags
Returns a JSON list of tags the user has sent or received

### GET /users/:user_id/tags/outgoing
Returns a JSON list of tags the user has sent out

### GET /users/:user_id/tags/incoming
Returns a JSON list of tags the user has been hit by

### GET /users/:user_id/games/:game_id/tags
Returns a JSON list of tags the user has sent or received in the game

### POST /users/:user_id/games/:game_id/tags/outgoing
Send out a tag
###### Fields:
  time (required): (String) ISO-8601 date string of the time the tag was sent, can be generated with `Date.prototype.toJSON()`

### GET /users/:user_id/games/:game_id/tags/outgoing
Returns a JSON list of tags the user has sent out in the game

### GET /users/:user_id/games/:game_id/tags/incoming
Returns a JSON list of tags the user has been hit by within the game

### GET /users/:user_id/games/:game_id/tags/incoming/front
Returns a JSON list of tags that hit the user in the front sensor

### PUT /users/:user_id/games/:game_id/tags/incoming/front/:tag_id
Register that you have been hit in the front

### GET /users/:user_id/games/:game_id/tags/incoming/back
Returns a JSON list of tags that hit the user in the back sensor

### PUT /users/:user_id/games/:game_id/tags/incoming/back/:tag_id
Register that you have been hit in the back

### GET /users/:user_id/games/:game_id/tags/incoming/shoulder
Returns a JSON list of tags that hit the user in the shoulder sensor

### PUT /users/:user_id/games/:game_id/tags/incoming/shoulder/:tag_id
Register that you have been hit in the shoulder

### POST /games
Create a new game
###### Fields:
  start_time: (String) ISO-8601 date string of the game's start time, can be generated with `Date.prototype.toJSON()`
  end_time: (String) ISO-8601 date string of the game's end time, can be generated with `Date.prototype.toJSON()`

### GET /games
List all games

### GET /games/:game_id
Returns the Game object with the corresponding id

### PUT /games/:game_id
Edits the Game object with the corresponding id
###### Fields:
  start_time: (String) ISO-8601 date string of the game's start time, can be generated with `Date.prototype.toJSON()`
  end_time: (String) ISO-8601 date string of the game's end time, can be generated with `Date.prototype.toJSON()`

### DEL /games/:game_id
Removes all traces of the Game object with the corresponding id. Warning: it also deletes ALL tags sent in the game, disassociates all users from the game and DELETES any users who are not in any other game

### GET /games/:game_id/users
Lists all users in the game

### POST /games/:game_id/users
Creates a user and adds them to the game
###### Fields:
  name (required): (String) The user's name

### GET /games/:game_id/tags
Lists all tags in the game that have not been received yet

### GET /games/:game_id/tags/:tag_id
Returns a Tag object if it is in the game and has not been received
