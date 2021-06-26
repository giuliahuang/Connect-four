import Message from './../../../interfaces/Message'
import { Component, Input, OnInit } from '@angular/core'
import { SocketioService } from 'src/app/services/socketio.service'
import { UserHttpService } from 'src/app/services/user-http.service'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @Input() friendUsername!: string
  messageText: string = ''
  messageArray: Array<Message>=[];
  username!: string

  constructor(
    private socketService: SocketioService,
    private userHttpService: UserHttpService) {
    this.username = this.userHttpService.username
  }

  ngOnInit(): void {
    this.messageArray = []
    this.socketService.requestMessageHistory(this.friendUsername)
    this.socketService.receiveMessageHistory().subscribe(history => {
      for(var i = 0; i<history.length; i++)
        this.messageArray.push({ username:history[i].sender, content: history[i].content})
    })

    this.socketService.receiveMessage().subscribe((message: any) => {
      const newMessage: Message = {
        username: message.username,
        content: message.content
      }
      this.messageArray.push(newMessage)
    })
  }

  sendMessage() {
    if (this.messageText.trim().length !== 0 && this.messageText.length <= 150) {
      const message: Message = {
        username: this.username,
        content: this.messageText
      }
      this.socketService.sendMessage(this.messageText, this.friendUsername)
      this.messageArray.push(message)
    }
    this.messageText = ''
  }

  receiveMessage() {
    this.socketService.receiveMessage().subscribe((data: any) => {
      this.messageArray.push({ username: data.player, content: data.message })
      this.messageText = ''
    })
  }

}
