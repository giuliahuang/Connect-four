import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { GamesocketService } from 'src/app/services/gamesocket.service'
import { SocketioService } from 'src/app/services/socketio.service'
import { UserHttpService } from 'src/app/services/user-http.service'
import { EndgameDialogComponent } from '../endgame-dialog/endgame-dialog.component'

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})

export class MatchComponent implements OnInit {
  cell: any[] = []
  heights: number[] = []
  player: any
  otherPlayer: any

  constructor(
    private gamesocketService: GamesocketService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private userHttpService: UserHttpService,
    private socketIoService: SocketioService
  ) {
    this.player = {
      username: userHttpService.username,
      color: socketIoService.color
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
  }

  ngOnInit(): void {
    this.newGame()
    this.receiveGameUpdate()
    this.receiveEndMatch()
    this.receiveWinnerMessage()
    this.receivePlayerMoveRejection()
    this.receivePlayerDisconnetedMessage()
  }

  //initialization of the game
  newGame() {
    this.heights = Array(7).fill(0)
    this.cell = Array(42).fill(null)
  }

  //opens a dialog with the winner message and an exit button
  openDialog(message: String) {
    this.dialog.open(EndgameDialogComponent, { data: { message: message } })
  }

  //receives a disconnection message with the user and its reason
  receivePlayerDisconnetedMessage() {
    this.gamesocketService.receivePlayerMoveRejection().subscribe((message: any) => {
      //TODO
      console.log(`player ${message.username} has disconnected for ${message.reason}`)
    })
  }

  //receive a rejection when it is not the right player move
  receivePlayerMoveRejection() {
    this.gamesocketService.receivePlayerMoveRejection().subscribe((message: any) => {
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
    this.gamesocketService.receiveGameUpdate().subscribe((message: any) => {
      this.addDot(message.column, message.player)
    })
  }

  //sends a request to the server to add a dot
  addDotRequest(index: number) {
    var col = index % 7
    console.log('add dot request at col ' + col)
    this.gamesocketService.addDotRequest(col)
  }

  //end of match
  receiveEndMatch() {
    this.gamesocketService.receiveEndMatch().subscribe((username) => {
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
      this.cell.splice(col + (7 * (5 - this.heights[col])), 1, color)
      this.heights[col]++
    }
  }

  //receives the order of the player and sets the starting color
  // receivePlayers() {
  //   this.gamesocketService.gamesocket?.on('order', (message) => {
  //     this.player1.username = message.player1
  //     this.player2.username = message.player2
  //     console.log(this.player1)
  //     console.log(this.player2)
  //     this.nextColor = message.random
  //   })
  // }
}
