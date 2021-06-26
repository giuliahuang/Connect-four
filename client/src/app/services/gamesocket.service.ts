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

  //socket connection to the given match port
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

  //gets the player during the match
  getPlayers() {
    this.gamesocket?.on('gamePlayers', (message) => {
      this.players = message
      this.router.navigate(['/match'])
    })
  }

  //sends a request to insert a disc
  addDotRequest(col: number) {
    this.gamesocket?.emit('insertDisc', col)
  }

  //receives a rejection of a disc insertion
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

  //notifies a player's friends his end of match
  receiveEndMatch() {
    return new Observable((observer) => {
      this.gamesocket?.on('stoppedPlaying', (message) => {
        observer.next(message)
      })
    })
  }

  //a user sends a message during the game
  sendMessage(message: String) {
    this.gamesocket?.emit('message', message)
  }


  //a user receives a message during the game
  receiveMessage() {
    return new Observable((observer) => {
      this.gamesocket?.on('message', (message) => {
        observer.next(message)
      })
    })
  }

  //receives the users joined in the room
  receiveJoinedPlayers() {
    return new Observable((observer) => {
      this.gamesocket?.on('joinGame', (message) => {
        observer.next(message)
      })
    })
  }

  //receives the status of the game in progress
  receiveGameStatus() {
    return new Observable((observer) => {
      this.gamesocket?.on('gameStatus', (message) => {
        observer.next(message)
      })
    })
  }
}
