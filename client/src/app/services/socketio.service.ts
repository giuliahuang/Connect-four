import { Message } from '@angular/compiler/src/i18n/i18n_ast'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { io, Socket } from 'socket.io-client'
import { environment } from 'src/environments/environment'
import Message from '../interfaces/Message'
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
    this.socket.on('ok', message => {
      console.log(message)
    })
    this.socket.emit('joinGame', 'joined on initial websocket')
  }

  receiveMatchPort(token: any) {
    console.log('waiting for port')
    this.socket?.on('matched', (message: any) => {
      this.isFirst = message.first
      this.color = message.color
      this.otherPlayer = message.otherPlayer
      this.gs.connectMatch(
        io('http://localhost:' + message.port, {
          'forceNew': true,
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
        }))
    })
  }

  JoinFriendMatchPort(data:any){
    this.isObserver=data.isObserver
    this.isFirst = data.first
    this.color = data.color
    this.currentPlayer = data.player1
    this.otherPlayer = data.player2

    this.gs.connectMatch(
      io('http://localhost:' +data.port, {
        'forceNew': true,
        extraHeaders: {
          'x-auth-token': data.token
        },
        transportOptions: {
          polling: {
            extraHeaders: {
              'x-auth-token': data.token
            }
          }
        },
      }))
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

  sendInviteResponse(hasAccepted: boolean, username: string) {
    var message = {
      hasAccepted: hasAccepted,
      inviterUsername: username,
    }
    this.socket?.emit('inviteResponse', message)
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
