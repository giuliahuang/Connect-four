import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable } from 'rxjs'
import { Socket } from 'socket.io-client'
import { UserHttpService } from './user-http.service'
import { io } from 'socket.io-client'
import { AuthenticationService } from './auth/authentication.service'

@Injectable({
  providedIn: 'root'
})
export class GamesocketService {

  gamesocket: Socket | undefined
  public players: any

  constructor(
    private router: Router,
    private us: UserHttpService,
    private authenticationService: AuthenticationService
  ) { }

  connectMatch(port: number) {
    const token = this.authenticationService.getToken()?.replace("Bearer ", "")
    if (token) {
      this.gamesocket = io('http://localhost:' + port, {
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
      })
      this.getPlayers()

    }
  }

  getPlayers() {
    this.gamesocket?.on('gamePlayers', (message) => {
      this.players = message
      this.router.navigate(['/match'])
    })
  }

  addDotRequest(col: number) {
    this.gamesocket?.emit('insertDisc', col)
  }

  receivePlayerMoveRejection() {
    return new Observable((observer) => {
      this.gamesocket?.on('playerMoveRejection', (message) => {
        observer.next(message)
      })
    })
  }

  //receive from the server the acceptance to add a dot
  receiveGameUpdate() {
    return new Observable((observer) => {
      this.gamesocket?.on('dot', (message) => {
        observer.next(message)
      })
    })
  }

  receiveEndMatch() {
    return new Observable((observer) => {
      this.gamesocket?.on('stoppedPlaying', (message) => {
        observer.next(message)
      })
    })
  }

  sendMessage(message: String) {
    this.gamesocket?.emit('message', message)
  }

  receiveMessage() {
    return new Observable((observer) => {
      this.gamesocket?.on('message', (message) => {
        observer.next(message)
      })
    })
  }

  receiveJoinedPlayers() {
    return new Observable((observer) => {
      this.gamesocket?.on('joinGame', (message) => {
        observer.next(message)
      })
    })
  }

  receiveGameStatus() {
    return new Observable((observer) => {
      this.gamesocket?.on('gameStatus', (message) => {
        observer.next(message)
      })
    })
  }
}
