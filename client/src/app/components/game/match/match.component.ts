import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Subject, Subscription } from 'rxjs'
import { GamesocketService } from 'src/app/services/gamesocket.service'
import { SocketioService } from 'src/app/services/socketio.service'
import { UserHttpService } from 'src/app/services/user-http.service'
import { EndgameDialogComponent } from '../endgame-dialog/endgame-dialog.component'

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})

export class MatchComponent implements OnInit, OnDestroy {
  cell: any[] = []
  heights: number[] = []
  player: any
  otherPlayer: any
  isMyTurn: boolean

  isObserver:boolean

  gameUpdatesSubscription!: Subscription
  endMatchSubscription!: Subscription
  winnerSubscription!: Subscription
  playerMoveRejectionSubscription!: Subscription
  playerDisconnetedSubscription!: Subscription

  eventsSubject: Subject<any> = new Subject<any>()

  emitEventToChild(message: any) {
    this.eventsSubject.next(message)
  }

  constructor(
    private gamesocketService: GamesocketService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private userHttpService: UserHttpService,
    private socketIoService: SocketioService
  ) {
    
    this.isObserver = this.socketIoService.isObserver
    if(!this.isObserver){
      this.player = {
        username: userHttpService.username,
        color: socketIoService.color
      }
    }
    else{
      this.player = {
        username: this.socketIoService.currentPlayer,
        color:socketIoService.color
      }
    }
    let otherColor: string
    if (this.player.color === 'red')
      otherColor = 'blue'
    else
      otherColor = 'red'
    this.otherPlayer = {
      username: socketIoService.otherPlayer,
      color: otherColor
    }
    this.isMyTurn = this.socketIoService.isFirst
  }

  get turnMessage() {
    if (this.isMyTurn) return 'It\'s your turn to play!'
    else return `Wait for ${this.otherPlayer.username} to make a move`
  }

  ngOnInit(): void {
    this.newGame()
    this.gameUpdatesSubscription = this.receiveGameUpdate()
    this.endMatchSubscription = this.receiveEndMatch()
    this.receiveWinnerMessage()
    this.playerMoveRejectionSubscription = this.receivePlayerMoveRejection()
    this.receivePlayerDisconnetedMessage()

    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd)
        this.gamesocketService.gamesocket?.disconnect()
    })
  }

  ngOnDestroy() {
    this.gameUpdatesSubscription?.unsubscribe()
    this.endMatchSubscription?.unsubscribe()
    this.winnerSubscription?.unsubscribe()
    this.playerMoveRejectionSubscription?.unsubscribe()
    this.playerDisconnetedSubscription?.unsubscribe()
  }

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
    this.gamesocketService.gamesocket?.on('playerDisconnected', () => {
      this.openDialog('You won by forfeit')
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
      console.log('End Match of ' + username)
      this.router.navigate(['/user'])
    })
  }

  //adds a dot to the gameboard
  private addDot(col: number, player: string) {
    if (this.heights[col] < 7) {
      let color: string
      if (player === this.player.username)
        color = this.player.color
      else
        color = this.otherPlayer.color
      const cellIndex = col + (7 * (5 - this.heights[col]))
      this.emitEventToChild({ index: cellIndex, color })
      this.cell.splice(cellIndex, 1, color)
      this.heights[col]++
    }
  }
}
