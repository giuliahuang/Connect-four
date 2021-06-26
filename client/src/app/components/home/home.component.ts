import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { AuthenticationService } from 'src/app/services/auth/authentication.service'
import { SocketioService } from 'src/app/services/socketio.service'
import { LobbyDialogComponent } from '../game/lobby-dialog/lobby-dialog.component'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private socketIoService: SocketioService,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void { }

  openDialog() {
    this.dialog.open(LobbyDialogComponent, { disableClose: true })
  }

  //an user can invite another user (in his friends' list)
  invite() {

  }

  //adds the user in the lobby to find a match
  startGame() {
    this.socketIoService.startGame()
    this.openDialog()
    this.socketIoService.receiveMatchPort()
  }
}
