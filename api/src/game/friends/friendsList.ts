import { Socket } from "socket.io"
import logger from "../../logger"
import { getFriends } from "../../mongo/friendsMethods"

export async function getOnlineFriends(username: string, socket: Socket): Promise<string[]> {
  let onlineFriends: string[] = []
  try {
    const friendsList = await getFriends(username)
    const onlineUsers = socket.rooms
    onlineUsers.forEach(user => {
      if (friendsList.includes(user)) onlineFriends.push(user)
    })
  } catch (err) {
    logger.error(err)
  }
  return onlineFriends
}