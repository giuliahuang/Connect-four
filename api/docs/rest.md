| Endpoints                    | Attributes | Method | Description                                                                             |
| ---------------------------- | ---------- | ------ | --------------------------------------------------------------------------------------- |
| /health                      | -          | GET    | API health check endpoint                                                               |
| /login                       | -          | POST   | Logs an existing user in, returns a JWT                                                 |
| /login/first                 | -          | POST   | Lets a moderator replace the temp password with a new one                               |
| /login/newpassword           | -          | POST   | Lets a user reset the password                                                          |
| /signup                      | -          | POST   | Creates a new user                                                                      |
| /auth/profile                | -          | GET    | Returns the profile of the logged user                                                  |
| /auth/profile/avatar         | -          | PUT    | Uploads a new avatar for the logged user                                                |
| /auth/profile/:username      | -          | GET    | Returns the profile of the specified user if it exists and and it's in the friends list |
| /auth/friends                | -          | GET    | Returns all friends of logged user                                                      |
| /auth/friends                | -          | POST   | Sends a friend request to the specified user                                            |
| /auth/friends/:username      | -          | DELETE | Removes the specified user from the friends list of the logged user                     |
| /auth/friends/friendrequests | -          | GET    | Returns all received friend requests                                                    |
| /auth/friends/friendrequests | -          | POST   | Sends a reply to a received friend request                                              |
| /ranking                     | -          | GET    | Returns top 10 players                                                                  |
| /sudo/mods                   | -          | GET    | Returns the list of moderators                                                          |
| /sudo/mods                   | -          | PUT    | Creates a new moderator account                                                         |
| /sudo/users/:username        | -          | DELETE | Deletes the specified user                                                              |
| /auth/search/:username       | -          | GET    | If the user exists it returns the user's profile                                        |
