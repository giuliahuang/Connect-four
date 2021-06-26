import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { AuthenticationService } from 'src/app/services/auth/authentication.service'
import { DialogService } from 'src/app/services/dialog.service'
import { SocketioService } from 'src/app/services/socketio.service'
import { LobbyDialogComponent } from '../game/lobby-dialog/lobby-dialog.component'

interface FriendInMatch {
  username: string,
  port: number,
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(
    private socketIoService: SocketioService,
    private authenticationService: AuthenticationService,
    private dialogService: DialogService,
    private snackbar:MatSnackBar
    ) { }

  ngOnInit(): void { 
    this.receiveInviteRequest();
    this.receiveInviteResponse();
  }

  openLobbyDialog() {
    this.dialogService.openLobbyDialog()
  }

  receiveInviteRequest(){
    this.socketIoService.receiveInviteRequest().subscribe((message:any)=>{
      this.dialogService.openInviteDialog(message).afterClosed().subscribe(res =>{
        this.socketIoService.sendInviteResponse(res,message)
        this.socketIoService.receiveMatchPort()
      })
    })
  }

  receiveMatchPort(){
    this.socketIoService.receiveMatchPort()
  }

  receiveInviteResponse(){
    this.socketIoService.receiveInviteResponse().subscribe((message)=>{
      this.snackbar.open((message as string),'',{
        duration: 3000,
      });
      this.receiveMatchPort();
    })
  }
  //adds the user in the lobby to find a match
  startGame() {
    this.socketIoService.startGame()
    this.openLobbyDialog()
    this.socketIoService.receiveMatchPort()
  }
}
