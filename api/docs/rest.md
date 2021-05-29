| Endpoints                    | Attributes | Method | Description                                                         |
| ---------------------------- | ---------- | ------ | ------------------------------------------------------------------- |
| /health                      | -          | GET    | API health check endpoint                                           |
| /login                       | -          | POST   | Logs an existing user in, returns a JWT                             |
| /signup                      | -          | POST   | Creates a new user                                                  |
| /auth/profile                | -          | GET    | Returns the profile of the logged user                              |
| /auth/stats                  | -          | GET    | Returns the game stats of the logged user                           |
| /auth/friends                | -          | GET    | Returns all friends of logged user                                  |
| /auth/friends                | -          | POST   | Sends a friend request to the specified user                        |
| /auth/friends                | -          | DELETE | Removes the specified user from the friends list of the logged user |
| /auth/friends/friendrequests | -          | GET    | Returns all received friend requests                                |
| /auth/friends/friendrequests | -          | POST   | Sends a reply to a received friend request                          |
| /ranking                     | -          | GET    | Returns top 10 players                                              |
