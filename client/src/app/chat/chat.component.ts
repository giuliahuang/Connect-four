import { Component, OnInit } from '@angular/core';
import { GamesocketService } from '../gamesocket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

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
