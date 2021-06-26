import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { AuthenticationService } from 'src/app/services/auth/authentication.service'
import { SocketioService } from 'src/app/services/socketio.service'
import { LobbyDialogComponent } from '../game/lobby-dialog/lobby-dialog.component'
import { NotificationsService } from 'angular2-notifications'

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

  
  friendInMatch: Array<FriendInMatch>

  constructor(
    private socketIoService: SocketioService,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationsService,
    ) {
      this.friendInMatch = this.getFriendInMatchList()
    }

  ngOnInit(): void {
    this.receiveStartedPlaying()
    this.receiveStoppedPlaying()
    this.reiceveFriendReqNot()
   }

  openDialog() {
    this.dialog.open(LobbyDialogComponent, { disableClose: true })
  }

  //an user can invite another user (in his friends' list)
  invite() {

  }

  onRequest(username:string){
    this.notificationService.info('Request', "You receive a friend requesto from " + username, {
      position: ['bottom', 'right'],
      timeOut: 2000,
      animate: 'fade',
      showProgressBar: true,
    })
  }


  reiceveFriendReqNot(){
    this.socketIoService.receiveFriendReqMsg().subscribe((message)=>{
      console.log("Friend request from : " + message)
      this.onRequest(message as string)
    })
  }

  //adds the user in the lobby to find a match
  startGame() {
    this.socketIoService.startGame()
    this.openDialog()
    this.socketIoService.receiveMatchPort(this.authenticationService.getToken()?.replace("Bearer ", ""))
  }

  
  
  //delets the user information from the friendInMatch list
  deleteFromList(index: number) {
    if (index > -1) {
      this.friendInMatch!.splice(index, 1)
    }
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

  //receives the data of the player who finished the play and deletes it from the list
  receiveStoppedPlaying() {
    this.socketIoService.receiveStoppedPlaying().subscribe((message: any) => {
      this.deleteFromList(this.friendInMatch.indexOf(message))
    })
  }



  //receives the data of the player who started the play and adds it to the list
  receiveStartedPlaying() {
    this.socketIoService.receiveStartedPlaying().subscribe((message: any) => {
      console.log(this.friendInMatch)
      var data:any = {
        token: this.authenticationService.getToken()!.replace("Bearer ", ""),
        port: message.port,
        isObserver:true,
        player1:message.username1,
        player2:message.username2,
        first:message.first,
        color:message.color,
      }
      this.friendInMatch!.push(data)
      this.socketIoService.JoinFriendMatchPort(data)
    })
  }
}
