import { Component, OnInit, Input, HostBinding, OnChanges, SimpleChanges } from '@angular/core'
import { GamesocketService } from 'src/app/services/gamesocket.service'
import { SocketioService } from 'src/app/services/socketio.service'
import { UserHttpService } from 'src/app/services/user-http.service'

@Component({
  selector: 'app-gamechat',
  templateUrl: './gamechat.component.html',
  styleUrls: ['./gamechat.component.scss']
})
export class GamechatComponent implements OnInit {
  @Input() playerColor: string = ''
  otherPlayerColor: string = ''
  username: string = ''
  otherUsername: string = ''
  isObserver: boolean
  messageText: String = ''
  messageArray: Array<{ user: String, message: String }> = [];

  constructor(
    private gamesocketService: GamesocketService,
    private userHttpService: UserHttpService,
    private socketIoService: SocketioService
    ) {
    this.isObserver=this.socketIoService.isObserver
    if(!this.isObserver){
      this.username = this.userHttpService.username
    }
    else{
      this.username = this.socketIoService.currentPlayer
    }
    this.otherUsername = this.socketIoService.otherPlayer
  }

  ngOnInit(): void {
    this.receiveMessage()
    console.log(this.playerColor)
    if (this.playerColor === 'red')
      this.otherPlayerColor = 'blue'
    else
      this.otherPlayerColor = 'red'
  }

  sendMessage() {
    if (this.messageText.trim().length !== 0 && this.messageText.length <= 150) {
      this.gamesocketService.sendMessage(this.messageText)
    }
    this.messageText = ''
  }

  receiveMessage() {
    console.log("START RECEIVING")
    this.gamesocketService.receiveMessage().subscribe((data: any) => {
      
      console.log("RECEIVED")
      this.messageArray.push({ user: data.player, message: data.message })
      this.messageText = ''
    })
  }
}
