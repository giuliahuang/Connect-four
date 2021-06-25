import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketioService } from 'src/app/services/socketio.service';
import { UserHttpService } from 'src/app/services/user-http.service';
import * as jwtdecode from 'jwt-decode';
import { LobbyDialogComponent } from '../../game-components/lobby-dialog/lobby-dialog.component';
import { MatDialog } from '@angular/material/dialog'
import { InviteDialogComponent } from '../../game-components/invite-dialog/invite-dialog.component';
import { DialogService } from 'src/app/services/dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';


interface TokenData {
  username:string,
  mail:string,
  roles:string[],
  id:string
}


interface FriendInMatch {
  username: string,
  port: number,
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})


export class UserComponent implements OnInit {

  errorMsg = ""
  friendInMatch: Array<FriendInMatch>


  constructor(
    private snackbar: MatSnackBar,
    private router:Router,
    private socketIoService:SocketioService,
    private us:UserHttpService,
    private dialog: MatDialog,
    private dialogService:DialogService
    ) {
      this.friendInMatch = this.getFriendInMatchList()
     }

  ngOnInit(): void {
    this.receiveStartedPlaying()
    this.receiveStoppedPlaying()
    this.receiveInviteRequest()
    this.receiveInviteResponse()
  }



  observeMatch(){
    this.socketIoService.joinGameMatch(this.us.get_token,this.friendInMatch[0].port)
  }


  //receives not matched error
  receiveNotMatchedError(){
    this.socketIoService.socket?.on('notMatched',(message)=>{
      this.errorMsg = message;
    })
  }
  
  //returns the friendInMatch list if it exists
  getFriendInMatchList(): Array<FriendInMatch> {
    if (this.friendInMatch != undefined) {
      return this.friendInMatch
    }
    else {
      return this.friendInMatch = []
    }
  }


  //adds the user in the lobby to find a match
  startGame(){
    this.socketIoService.startGame()
    this.dialogService.openLobbyDialog()
    this.receiveNotMatchedError();
    this.receiveMatchPort();
  }

  
  //delets the user information from the friendInMatch list
  deleteFromList(index: number) {
    if (index > -1) {
      this.friendInMatch!.splice(index, 1)
    }
  }

  receiveMatchPort(){
    this.socketIoService.receiveMatchPort(this.us.get_token().replace("Bearer ",""))
  }
  
  receiveInviteRequest(){
    console.log("receive invite request")
    this.socketIoService.receiveInviteRequest().subscribe((message:any)=>{
      this.dialogService.openInviteDialog(message).afterClosed().subscribe(res =>{
        console.log(res)
        this.socketIoService.sendInviteResponse(res,message)
        this.socketIoService.receiveMatchPort(this.us.get_token().replace("Bearer ",""))
      })
    })
  }

  
  receiveStoppedPlaying() {
    console.log("receive stopped playing")
    this.socketIoService.receiveStoppedPlaying().subscribe((message: any) => {
      this.deleteFromList(this.friendInMatch.indexOf(message))
      console.log("Stopped Playing")
      console.log(this.friendInMatch)
    })
  }

  //receives the data of the player who started the play and adds it to the list
  receiveStartedPlaying() {
    console.log("receive start playing")
    this.socketIoService.receiveStartedPlaying().subscribe((message: any) => {
      this.friendInMatch!.push(message)
      
    })
  }

  receiveInviteResponse(){
    console.log("receive invite response")
    this.socketIoService.receiveInviteResponse().subscribe((message)=>{
      console.log(message)
      this.snackbar.open((message as string),'',{
        duration: 3000,
      });
      this.receiveMatchPort();
    })
  }
}
