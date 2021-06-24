import { Component, OnInit } from '@angular/core';
import { SocketioService } from '../../services/socketio.service'

interface FriendInMatch{
  username:string,
  port:number,
}

@Component({
  selector: 'app-friendtmp',
  templateUrl: './friendtmp.component.html',
  styleUrls: ['./friendtmp.component.scss']
})
export class FriendtmpComponent implements OnInit {

  friendInMatch:Array<FriendInMatch>;
  hasAccepted:boolean = false
  inviterUsername:string = ""


  constructor(
    private socketioService:SocketioService
  ) { 
    this.friendInMatch=this.getFriendInMatchList();
  }

  ngOnInit(): void {
  }

  sendInviteRequest(username:string){
    this.socketioService.sendInviteRequest(username);
  }

  receiveInviter(){
    this.socketioService.socket?.on('invite',username=>{
      this.inviterUsername=username;
    })
  }

  sendInviteResponse(){

    this.socketioService.sendInviteResponse(this.hasAccepted,this.inviterUsername);
  }

  
  receiveInviteResponse(){


    this.socketioService.socket?.on('inviteResponse',(message)=>{
      this.hasAccepted=message;
    })
  }

  //delets the user information from the friendInMatch list
  deleteFromList(index:number){
    if (index > -1) {
      this.friendInMatch!.splice(index, 1);
   }
  }

  
  //returns the friendInMatch list if it exists
  getFriendInMatchList():Array<FriendInMatch>{
    if(this.friendInMatch!=undefined){
      return this.friendInMatch
    }
    else{
      return this.friendInMatch=[]
    }
  }
  
  //receives the data of the player who finished the play and deletes it from the list
  receiveStoppedPlaying(){
    this.socketioService.receiveStoppedPlaying().subscribe((message:any)=>{
      this.deleteFromList(this.friendInMatch.indexOf(message))
    })
  }


  
  //receives the data of the player who started the play and adds it to the list
  receiveStartedPlaying(){
    this.socketioService.receiveStartedPlaying().subscribe((message:any)=>{
      this.friendInMatch!.push(message);
    })
  }

}
