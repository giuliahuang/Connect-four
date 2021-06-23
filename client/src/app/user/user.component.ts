import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketioService } from '../socketio.service';
import { UserHttpService } from '../user-http.service';
import * as jwtdecode from 'jwt-decode';
import { LobbyDialogComponent } from '../lobby-dialog/lobby-dialog.component';
import { MatDialog } from '@angular/material/dialog'


interface TokenData {
  username:string,
  mail:string,
  roles:string[],
  id:string
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})


export class UserComponent implements OnInit {

  errorMsg = ""

  constructor(
    private router:Router,
    private socketIoService:SocketioService,
    private us:UserHttpService,
    private dialog: MatDialog,
    ) { }

  ngOnInit(): void {
  }

  openDialog(){
    this.dialog.open(LobbyDialogComponent, { disableClose: true })
  }
  

  //an user can invite another user (in his friends' list)
  invite(){

  }

  //receives not matched error
  receiveNotMatchedError(){
    this.socketIoService.socket?.on('notMatched',(message)=>{
      this.errorMsg = message;
    })
  }

  //adds the user in the lobby to find a match
  startGame(){
    this.socketIoService.startGame()
    this.openDialog();
    this.receiveNotMatchedError();
    this.socketIoService.receiveMatchPort(this.us.get_token().replace("Bearer ",""))
  }

}
