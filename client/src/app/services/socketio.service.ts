import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { io, Socket } from 'socket.io-client'
import { environment } from 'src/environments/environment'
import { AuthenticationService } from './auth/authentication.service'
import { GamesocketService } from './gamesocket.service'

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket: Socket | undefined
  gamesocket: Socket | undefined

  public otherPlayer: string = ''
  public isFirst: boolean = false
  public color: string = ''

  constructor(
    private gs: GamesocketService,
    private auth: AuthenticationService
  ) {
    const token = this.auth.getToken()
    if (token)
      this.connect(token.replace("Bearer ", ""))
  }

  connect(token: any) {
    this.socket = io(environment.SOCKET_ENDPOINT, {
      extraHeaders: {
        'x-auth-token': token
      },
      transportOptions: {
        polling: {
          extraHeaders: {
            'x-auth-token': token
          }
        }
      },
    })
    this.socket.on('ok', message => {
      console.log(message)
    })
    this.socket.emit('joinGame', 'joined on initial websocket')
  }

  receiveMatchPort() {
    console.log('waiting for port')
    this.socket?.on('matched', (message: any) => {
      this.isFirst = message.first
      this.color = message.color
      this.otherPlayer = message.otherPlayer
      this.gs.connectMatch(message.port)
    })
  }

  startGame() {
    this.socket?.emit('startGame', "someone is starting the game")
    this.socket?.emit('play')
  }

  cancelPlay() {
    console.log("calcel play request")
    this.socket?.emit('cancelPlay')
  }

  receiveStartedPlaying() {
    return new Observable((observer) => {
      this.socket?.on('startedPlaying', (message) => {
        console.log("有好友开始了游戏")
        observer.next(message)
      })
    })
  }

  receiveStoppedPlaying() {
    return new Observable((observer) => {
      this.socket?.on('stoppedPlaying', (message) => {
        
        console.log("有好友结束了游戏")
        observer.next(message)
      })
    })
  }

  sendInviteRequest(username: string) {
    console.log("invite request sent")
    this.socket?.emit('invite', username)
  }

  receiveInviteRequest(){
    return new Observable((observer)=>{
      this.socket?.on('invite',(message)=>{
        console.log("Invite request received")
        observer.next(message)
        observer.unsubscribe()
      })
    })
  }

  sendInviteResponse(hasAccepted: boolean, username: string) {
    var message = {
      hasAccepted: hasAccepted,
      inviterUsername: username,
    }
    console.log("inviteResponse emitted")
    this.socket?.emit('inviteResponse', message)
  }

  receiveInviteResponse(){
    return new Observable((observer)=>{
      this.socket?.on('inviteResponse',(message)=>{
        observer.next(message);
        observer.unsubscribe();
      })
    })

  }

  getOnlineFriend() {
    return new Observable<any>(observer => {
      this.socket?.on('friendConnected', (data) => observer.next(data))
    })
  }

  getFriendDisconnected() {
    return new Observable<any>(observer => {
      this.socket?.on('friendDisconnected', (data) => observer.next(data))
    })
  }

  sendMessage(message: string, destUsername: string) {
    this.socket?.emit('dm', message, destUsername)
  }

  receiveMessage() {
    return new Observable((observer) => {
      this.socket?.on('dm', (message: string, username: string) => {
        observer.next({ content: message, username })
      })
    })
  }

  requestMessageHistory(friendUsername: string) {
    this.socket?.emit('history', friendUsername)
  }

  receiveMessageHistory() {
    return new Observable<any>(observer => {
      this.socket?.on('history', (messages) => {
        observer.next(messages)
      })
    })
  }
}
