import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Subject } from 'rxjs'
import { GamesocketService } from 'src/app/services/gamesocket.service'
import { SocketioService } from 'src/app/services/socketio.service'
import { UserHttpService } from 'src/app/services/user-http.service'
import { EndgameDialogComponent } from '../endgame-dialog/endgame-dialog.component'

interface Player {
  username: string,
  color: string
}

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {
  username: string

  player1!: Player
  player2!: Player

  cell: any[] = []
  heights: number[] = []
  isMyTurn: boolean = false

  get color(): string {
    if (this.username === this.player1.username)
      return this.player1.color
    else if (this.username === this.player2.username)
      return this.player2.color
    return ''
  }

  eventsSubject: Subject<any> = new Subject<any>()

  emitEventToChild(message: any) {
    this.eventsSubject.next(message)
  }

  constructor(
    private gamesocketService: GamesocketService,
    private router: Router,
    private dialog: MatDialog,
    private userHttpService: UserHttpService,
    private socketIoService: SocketioService
  ) {
    this.username = userHttpService.username

    const players = this.gamesocketService.players
    this.player1 = players.player1
    this.player2 = players.player2
    if (this.username === this.player1.username)
      this.isMyTurn = true
  }

  get turnMessage() {
    if (this.isPlayer) {
      if (this.isMyTurn) return 'It\'s your turn to play!'
      else {
        if (this.username === this.player1.username)
          return `Wait for ${this.player2.username} to make a move`
        else
          return `Wait for ${this.player1.username} to make a move`
      }
    } else {
      if (this.isMyTurn) 
        return `Wait for ${this.player2.username} to make a move`
      else
        return `Wait for ${this.player1.username} to make a move`
    }
  }

  ngOnInit(): void {
    this.newGame()
    this.receiveGameUpdate()
    this.receiveEndMatch()
    this.receiveWinnerMessage()
    this.receivePlayerMoveRejection()
    this.receivePlayerDisconnetedMessage()

    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd)
        this.gamesocketService.gamesocket?.disconnect()
    })

  }

  // ngOnDestroy() {
  //   this.gameUpdatesSubscription?.unsubscribe()
  //   this.endMatchSubscription?.unsubscribe()
  //   this.winnerSubscription?.unsubscribe()
  //   this.playerMoveRejectionSubscription?.unsubscribe()
  //   this.playerDisconnetedSubscription?.unsubscribe()
  // }

  //initialization of the game
  newGame() {
    this.heights = Array(7).fill(0)
    this.cell = Array(42).fill(null)
  }

  //opens a dialog with the winner message and an exit button
  public openDialog(message: String) {
    this.dialog.open(EndgameDialogComponent, { data: { message: message } })
  }

  receivePlayerDisconnetedMessage() {
    this.gamesocketService.gamesocket?.on('playerDisconnected', (message) => {
      if(this.isPlayer)
        this.openDialog('You won by forfeit')
      else
        this.openDialog(`Player ${message} has forfeited the game`)
    })
  }

  //receive a rejection when it is not the right player move
  receivePlayerMoveRejection() {
    return this.gamesocketService.receivePlayerMoveRejection().subscribe((message: any) => {
      console.log(`player ${message.username} cannot add dot at column ${message.column}`)
    })
  }

  //receives a message when player wins the game
  receiveWinnerMessage() {
    this.gamesocketService.gamesocket?.on('winner', (message) => {
      this.openDialog(message)
    })
  }

  //updates the gameboard if allowed by the server
  receiveGameUpdate() {
    return this.gamesocketService.receiveGameUpdate().subscribe((message: any) => {
      this.addDot(message.column, message.player)
      this.isMyTurn = !this.isMyTurn
    })
  }

  //sends a request to the server to add a dot
  addDotRequest(index: number) {
    var col = index % 7
    this.gamesocketService.addDotRequest(col)
  }

  //end of match
  receiveEndMatch() {
    return this.gamesocketService.receiveEndMatch().subscribe((username) => {
      this.router.navigate(['/user'])
    })
  }

  //adds a dot to the gameboard
  private addDot(col: number, player: string) {
    if (this.heights[col] < 7) {
      let color: string
      if (player === this.player1.username)
        color = this.player1.color
      else
        color = this.player2.color

      const cellIndex = col + (7 * (5 - this.heights[col]))
      this.emitEventToChild({ index: cellIndex, color })
      this.cell.splice(cellIndex, 1, color)
      this.heights[col]++
    }
  }

  get isPlayer(): boolean {
    return this.username === this.player1.username ||
      this.username === this.player2.username
  }
}
