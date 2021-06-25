import { tokenName } from '@angular/compiler'
import { Token } from '@angular/compiler/src/ml_parser/lexer'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { observable, Observable } from 'rxjs'
import { io, Socket } from 'socket.io-client'
import { environment } from 'src/environments/environment'
import { GamesocketService } from './gamesocket.service'
import { LobbyDialogComponent } from '../components/game-components/lobby-dialog/lobby-dialog.component'
import { UserHttpService } from './user-http.service'
import { ObserverService } from './observer.service'

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket: Socket | undefined
  gamesocket: Socket | undefined


  constructor(
    private router: Router,
    private us: UserHttpService,
    private gs: GamesocketService,
    private os: ObserverService,
  ) {
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

  //provato sempre con match component ma non funziona perchè il server io non è in ascolto
  //il motivo è perchè non viene chiamato la funzione in cui il server io è in ascolto
  joinGameMatch(token: any, port: number){
    this.gs.connectObserverMatch(
      io('http://localhost:' + port, {
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
  }

  receiveMatchPort(token: any) {
    console.log('waiting for port')
    this.socket?.on('matched', (port) => {
      this.gs.connectMatch(
        io('http://localhost:' + port, {
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

  startGame() {
    this.socket!.emit('startGame', "someone is starting the game")
    this.socket!.emit('play')
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



}
