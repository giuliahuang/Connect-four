import { Component, OnInit } from '@angular/core';
import { SocketioService } from '../socketio.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  messageText!: String;
  messageArray:Array<{user:String,message:String}> = [];
  

  constructor(private socketIoService: SocketioService,) {
  }

  
  ngOnInit(): void {
    this.receiveMessage()
  }

  sendMessage(){
    console.log(this.messageText)
    if(this.messageText.length!=0){
      this.socketIoService.sendMessage(this.messageText)
    }
  }

  receiveMessage(){
    console.log("start receiving message")
    this.socketIoService.receiveMessage().subscribe( (data:any)=>{
      this.messageArray.push(data)
      this.messageText='';
    })
  }

}
