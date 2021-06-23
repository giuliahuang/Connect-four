import { Component, OnInit } from '@angular/core';
import { GamesocketService } from '../gamesocket.service';

@Component({
  selector: 'app-gamechat',
  templateUrl: './gamechat.component.html',
  styleUrls: ['./gamechat.component.scss']
})
export class GamechatComponent implements OnInit {

  messageText!: String;
  messageArray:Array<{user:String,message:String}> = [];
  

  constructor(
    private gamesocketService: GamesocketService,
    ) {
  }

  
  ngOnInit(): void {
    this.receiveMessage()
  }

  sendMessage(){
    console.log(this.messageText)
    if(this.messageText.length!=0){
      this.gamesocketService.sendMessage(this.messageText)
    }
  }

  receiveMessage(){
    this.gamesocketService.receiveMessage().subscribe( (data:any)=>{
      this.messageArray.push(data)
      this.messageText='';
    })
  }

}
