import { Socket } from "socket.io"
import User from "../../models/User"
import { getUsersByUsername } from "../../mongo/user"
import { gameStart } from "../gameplay/gameplay"
import { UnmatchedPlayer } from "../matchmaking/UnmatchedPlayer"
import { Player } from "../Player"

interface Invite {
  inviter: UnmatchedPlayer,
  invited: User,
  iat: Date
}

let inviteMap = new Map<string, Invite>()
const FIVE_MINUTES = 5 * 60000

export async function invitePlayer(socket: Socket, playerUsername: string) {
  const invited = await getUsersByUsername(playerUsername)

  if (invited) {
    const user: User = socket.request['user']
    const player: Player = {
      id: user._id,
      username: user.username,
      mmr: user.mmr
    }
    const unmatchedPlayer: UnmatchedPlayer = {
      player: player,
      timeJoined: 0,
      ws: socket
    }
    const invite: Invite = {
      inviter: unmatchedPlayer,
      invited: invited,
      iat: new Date(Date.now())
    }
    inviteMap.set(user.username, invite)
    socket.emit('invite', invited.username)
    setInterval(clearStaleInvites, FIVE_MINUTES)
  }
}

async function clearStaleInvites() {
  if (inviteMap.size == 0) return
  inviteMap.forEach((value, key, map) => {
    const fiveMinutesAgo = new Date(Date.now() - FIVE_MINUTES)
    if (value.iat < fiveMinutesAgo) inviteMap.delete(key)
  })
}

export async function inviteResponse(socket: Socket, hasAccepted: boolean, inviterUsername: string) {
  const invite = inviteMap.get(inviterUsername)

  if (invite) {
    inviteMap.delete(inviterUsername)
    const fiveMinutesAgo = new Date(Date.now() - FIVE_MINUTES)

    if ((invite.iat < fiveMinutesAgo) && hasAccepted) {
      const user: User = socket.request['user']
      const player: Player = {
        id: user._id,
        username: user.username,
        mmr: user.mmr
      }
      const unmatchedPlayer: UnmatchedPlayer = {
        player: player,
        timeJoined: 0,
        ws: socket
      }
      socket.to(inviterUsername).emit('inviteResponse', `${user.username} has accepted your invite`)
      gameStart(invite.inviter, unmatchedPlayer)
    }
  }
}
