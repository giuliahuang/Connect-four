import { userInfo } from "os"
import { Socket, Server as IOServer } from "socket.io"
import logger from "../../logger"
import User from "../../models/User"
import { getFriends } from "../../mongo/friendsMethods"

export async function getOnlineFriends(socket: Socket): Promise<string[]> {
  let onlineFriends: string[] = []
  try {
    const friendsList = await getFriends(socket.request['user'])
    const onlineUsers = socket.rooms
    onlineUsers.forEach(user => {
      if (friendsList.includes(user)) onlineFriends.push(user)
    })
  } catch (err) {
    logger.error(err)
  }
  return onlineFriends
}

export function sendMessage(user: User, message: string, destUsername: string, io: IOServer) {
  if (user.friends.includes(destUsername))
    io.to(destUsername).emit('dm', message)
  else
    io.to(user.username).emit('dm', `${destUsername} is not a valid friend`)
}

export async function disconnectClient(socket: Socket, reason: string, io: IOServer) {
  const user = socket.request['user']
  logger.info(`User ${user.username} disconnected because: ${reason}`)
  const onlineFriends = await getOnlineFriends(socket.request['user.username'])
  onlineFriends.forEach(friend => {
    io.to(friend).emit('friendDisconnected', user.username)
  })
}