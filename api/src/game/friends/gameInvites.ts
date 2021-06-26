import { Socket } from "socket.io"
import logger from "../../logger"
import User from "../../models/User"
import { getUserByUsername } from "../../mongo/userMethods"
import { gameStart } from "../gameplay/gameplay"
import PlayerWithWS from "../matchmaking/UnmatchedPlayer"
import Player from "../Player"
import Invite from "./Invite"

const inviteMap = new Map<string, Invite>()
const THIRTY_SECONDS = 30000

/**
 * Lets a user send a game invite to another user in their friends list
 * @param socket Socket.io instance, used for emitting the event
 * @param playerUsername username of the player invited to the game
 */
export async function invitePlayer(socket: Socket, playerUsername: string): Promise<void> {
  const user: User = socket.request['user']
  const invited = await getUserByUsername(playerUsername)

  if (invited && user.friends.includes(invited.username)) {
    const player: Player = {
      id: user._id,
      username: user.username,
      mmr: user.mmr
    }
    const unmatchedPlayer: PlayerWithWS = {
      player: player,
      timeJoined: 0,
      ws: socket
    }
    const invite: Invite = {
      inviter: unmatchedPlayer,
      invited: invited
    }
    inviteMap.set(user.username, invite)
    socket.to(invited.username).emit('invite', user.username)

    // if the invite is not accepted within 30 seconds it gets automatically rejected
    setTimeout(clearInvite, THIRTY_SECONDS, invite)
  }
}

// Deletes the specified invite from the hashmap
function clearInvite(invite: Invite) {
  inviteMap.delete(invite.inviter.player.username)
}

/**
 * Lets a user reply to a game invite that they received
 * @param socket instance of the user who provides the reply, used for emitting the event
 * @param hasAccepted indicates whether the user accepted the invite or otherwise
 * @param inviterUsername username of the user who sent the invite, used to retrieve the object from the hashmap
 */
export function inviteResponse(socket: Socket, hasAccepted: boolean, inviterUsername: string): void {
  const invite = inviteMap.get(inviterUsername)

  if (invite) {
    inviteMap.delete(inviterUsername)

    if (hasAccepted) {
      const user: User = socket.request['user']
      const player: Player = {
        id: user._id,
        username: user.username,
        mmr: user.mmr
      }
      const unmatchedPlayer: PlayerWithWS = {
        player: player,
        timeJoined: 0,
        ws: socket
      }
      socket.to(inviterUsername).emit('inviteResponse', `${user.username} has accepted your invite`)
      gameStart(invite.inviter, unmatchedPlayer)
    }
  }
}
