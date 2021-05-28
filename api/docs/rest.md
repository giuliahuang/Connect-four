| Endpoints     | Attributes | Method | Description                                                         |
| ------------- | ---------- | ------ | ------------------------------------------------------------------- |
| /health       | -          | GET    | API health check endpoint                                           |
| /login        | -          | POST   | Logs an existing user in, returns a JWT                             |
| /signup       | -          | POST   | Creates a new user                                                  |
| /auth/profile | -          | GET    | Returns the profile of the logged user                              |
| /auth/friends | -          | GET    | Returns all friends of logged user                                  |
| /auth/friends | -          | POST   | Sends a friend request to the specified user                        |
| /auth/friends | -          | DELETE | Removes the specified user from the friends list of the logged user |
| /ranking      | -          | GET    | Returns top 10 players                                              |
