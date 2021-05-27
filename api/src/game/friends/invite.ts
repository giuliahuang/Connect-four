import { Socket } from "socket.io"
import User from "../../models/User"
import { getUserById } from "../../mongo/user"
import extractTokenPayload from "../../utils/extractTokenPayload"
import { gameStart } from "../gameplay/gameplay"
import { UnmatchedPlayer } from "../matchmaking/UnmatchedPlayer"
import { Player } from "../Player"

// async function inviteHandler(req: any, socket: Socket) {
//   const payload = extractTokenPayload(req.jwt)
//   if (payload) {
//     const player = await getUserById(payload.sub)
//     if (player) {
//       const invited = await inviteToPlay(socket, player.username, req.invitee)
//       if (invited) {
//         const player1: Player = {
//           id: player._id,
//           mmr: player.mmr,
//         }
//         const player2: Player = {
//           id: invited.player.id,
//           mmr: invited.player.mmr,
//         }
//         gameStart({ player: player1, timeJoined: 0, ws: socket }, { player: player2, timeJoined: 0, ws: invited.ws })
//       } else {
//         socket.to(socket.id).emit('invite', 'Invite rejected')
//       }
//     }
//   }
// }

// export async function inviteToPlay(socket: Socket, inviter: any, invitee: any): Promise<UnmatchedPlayer> {
//   socket.to(invitee).emit("invite", inviter)




// }

// export function invitationResponse(res: any, socket: Socket) {
  // if (res.accept) {
  //   socket.to(res.src).emit("invite", 'Invitation accepted')
  //   const payload = extractTokenPayload(res.jwt)
  //   const player1 = getUserById(res.jwt)
  //   gameStart()
  // }
// }

// export async function awaitResponse(user: User) {

// }