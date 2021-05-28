Main Socket.io server:
Hosted at localhost:5000

Events:
-play()
  -Puts the client into matchmaking

-invite(socket: Socket, playerUsername: string)
  -Invites a user from the friend list to play a game

-inviteResponse(socket: Socket, hasAccepted: boolean, inviterUsername: string)
  -Replies to an invite to play. If the client has accepted the game starts.

-dm(message: string, destUsername: string)
  -Forwards a private message to an online friend

-disconnect()
  -Notifies the other users that the client has disconnected. Automatically triggered on connection lost.

Game Socket.io server events:
Hosted at localhost:random_port<8000-65535>

Events:
-message(message: string)
  -Writes the message in the chat. If the client is a player then everybody receives it, if it's an observer only other observers receive it

-dot(column: number)
  -Receives a player's move, checks it and consumes it. If it's accepted it is relayed to everyone else connected to the websocket server. If it's a winning move the game ends, the winner is declared and the MMR is updated
