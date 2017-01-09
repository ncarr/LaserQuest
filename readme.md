# Laser Quest

> The server for a science project to improve the Laser Quest experience

## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## Getting Started

Getting up and running is as easy as 1, 2, 3.

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install your dependencies

    ```
    cd path/to/laser-quest; npm install
    ```

3. Fill in the placeholder fields in both files in the `config` directory
4. Run `npm run setup` and follow the commands to set up your first user account.
5. Start your app

    ```
    npm start
    ```

## Testing

Simply run `npm test` and all your tests in the `test/` directory will be run.

## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

```
$ npm install -g feathers-cli             # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers generate model                 # Generate a new Model
$ feathers help                           # Show all commands
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).

## Changelog

__0.1.0__

- Initial release

## License

Copyright (c) 2016

Licensed under the [MIT license](LICENSE).

## API Documentation
As an example, to open a new franchise, you would send a POST request to `localhost:3030/locations`. All requests MUST be authenticated with a token you can get by sending a POST request to `/auth/local` with properly filled out email and password fields in the request body. This token can be given as an `Authorization` header, `token` field in a request body or `token` query parameter.

### POST /users
Hires a new employee
###### Fields:
  name (required): (String) Their name

  email (required): (String) Their laserquest.com email address

  password (required): (String) Their password in plain text. Ensure this route is encrypted before sending a password. The database will hash it before saving and hide the hash in further responses, so do not expect to get it back.

  location (required): (String) The location the employee will work at

### GET /users
Returns a JSON list of all employees

### GET /users/:id
Returns a Location object

### PUT /users/:id
Replaces the employee with the data you send
###### Fields:
  name: (String) Their name
  email: (String) Their laserquest.com email address
  password: (String) Their password in plain text. Ensure this route is encrypted before sending a password. The database will hash it before saving and hide the hash in further responses, so do not expect to get it back.
  location: (String) The location the employee will work at

### PATCH /users/:id
Updates each field you send with the values you send
###### Fields:
  name: (String) Their name

  email: (String) Their laserquest.com email address

  password: (String) Their password in plain text. Ensure this route is encrypted before sending a password. The database will hash it before saving and hide the hash in further responses, so do not expect to get it back.

  location: (String) The location the employee will work at

### DEL /users/:id
Deletes the employee

### POST /locations
Opens up a new Laser Quest franchise
###### Fields:
  address (required): (String) The street address

### GET /locations
Returns a JSON list of all locations

### GET /locations/:id
Returns a Location object

### PUT /locations/:id or PATCH /locations/:id
Updates the location's address
###### Fields:
  name (required): (String) The location's name

### DEL /locations/:id
Deletes the location, along with ANY DATA EVER COLLECTED while it was open. Players, games, tags, etc. are destroyed. Employees will have to change their work location the next time they sign back in

### POST /players
Creates a player
###### Fields:
  name (required): (String) The player's name

  location (required): (String) The id of the Location they are in

  games (optional): A list of all game ids the player is in

### GET /players
Returns a JSON list of all players

### GET /players/:id
Returns a Player object

### PATCH /players/:id
Updates the player's name to the contents of the name field
###### Fields:
  name (required): (String) The player's name
  games (optional): A list of all game ids the player is in

### DEL /players/:id
Deletes the player with the given id and removes them from any games they played

### POST /tags
Send out a tag
###### Fields:
  sender (required): (String) The id of the player that shot it

  game (required): (String) The id of the game it was shot in

  time (required): (String) ISO-8601 date string of the time the tag was sent, can be generated with `Date.prototype.toJSON()`

### GET /tags
List all tags/laser beams/shots that have been taken

### GET /tags/:id
Returns a Tag object

### PATCH /tags/:id
Updates a tag

###### Fields:
  receiver: (String) The id of the player who was shot by it

  sensor: (String) Either `front`, `back` or `shoulder`. The sensor the laser hit.

### POST /games
Create a new game
###### Fields:
  location (required): (String) The id of the location the game will take place in

  start_time: (String) ISO-8601 date string of the game's start time, can be generated with `Date.prototype.toJSON()`

  end_time: (String) ISO-8601 date string of the game's end time, can be generated with `Date.prototype.toJSON()`

### GET /games
List all games

### GET /games/:id
Returns the Game object with the corresponding id

### PATCH /games/:id
Edits the Game object with the corresponding id
###### Fields:
  players: A list of all players in the game

  start_time: (String) ISO-8601 date string of the game's start time, can be generated with `Date.prototype.toJSON()`
  
  end_time: (String) ISO-8601 date string of the game's end time, can be generated with `Date.prototype.toJSON()`

### DEL /games/:id
Removes all traces of the Game object with the corresponding id. Warning: it also deletes ALL tags sent in the game, disassociates all Players from the game and DELETES any players who are not in any other game
