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

  public isObserver: boolean = false
  public currentPlayer: string = ''

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
    this.socket?.emit('cancelPlay')
  }

  receiveStartedPlaying() {
    return new Observable((observer) => {
      this.socket?.on('startedPlaying', (message) => {
        observer.next(message)
      })
    })
  }

  receiveStoppedPlaying() {
    return new Observable((observer) => {
      this.socket?.on('stoppedPlaying', (message) => {
        observer.next(message)
      })
    })
  }

  sendInviteRequest(username: string) {
    this.socket?.emit('invite', username)
  }

  receiveInviteRequest() {
    return new Observable((observer) => {
      this.socket?.on('invite', (message) => {
        observer.next(message)
      })
    })
  }

  sendInviteResponse(hasAccepted: boolean, username: string) {
    var message = {
      hasAccepted: hasAccepted,
      inviterUsername: username,
    }
    this.socket?.emit('inviteResponse', message)
  }

  receiveInviteResponse() {
    return new Observable((observer) => {
      this.socket?.on('inviteResponse', (message) => {
        observer.next(message)
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

  addFriend(username: string) {
    this.socket?.emit('friendRequest', username)
  }

  receiveFriendRequest() {
    return new Observable(observer => {
      this.socket?.on('friendRequest', (username) => {
        console.log('request from ' + username)
        return observer.next(username)
      })
    })
  }
}
