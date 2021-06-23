Main Socket.io server:
Hosted at localhost:5000

Server Events:
-play()
  -Puts the client into matchmaking

-cancelPlay()
  -Removes the client from the matchmaking pool

-invite(username: string)
  -Invites a user from the friend list to play a game

-inviteResponse(hasAccepted: boolean, inviterUsername: string)
  -Replies to an invite to play. If the client has accepted the game starts.

-dm(message: string, destUsername: string)
  -Forwards a private message to an online friend

-disconnect()
  -Notifies the other users that the client has disconnected. Automatically triggered on connection lost.

Client Events:
-newMessages(string[])
  Sends all new messages to the logged user

Game Socket.io server events:
Hosted at localhost:random_port<8000-8100>

Server Events:
-message(message: string)
  -Writes the message in the chat. If the client is a player then everybody receives it, if it's an observer only other observers receive it

-insertDisc(column: number)
  -Receives a player's move, checks it and consumes it. If it's accepted it is relayed to everyone else connected to the websocket server. If it's a winning move the game ends, the winner is declared and the MMR is updated

Client Events:
-startedPlaying(username: string, port: number)
  Notifies the friends list of the user who started playing to update their status

-stoppedPlaying(string)
  Notifies the friends list of the user who stopped playing to update their status

-message(message: string, player: string)
  Sends a message to the clients, originated from player

-winner(string)
  Sends a string notifying all the clients that a specific user has won the game

moveRejection(column: number)
  Sends the rejected move back to the client who originated it

playerDisconnected(username: string, reason: string)
  Sends the username and reason of disconnection to all the clients if either player disconnects from the match socket prematurely