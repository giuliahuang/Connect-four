import { Component, OnInit, Input, HostBinding, OnChanges, SimpleChanges } from '@angular/core'
import { GamesocketService } from 'src/app/services/gamesocket.service'
import { UserHttpService } from 'src/app/services/user-http.service'

@Component({
  selector: 'app-gamechat',
  templateUrl: './gamechat.component.html',
  styleUrls: ['./gamechat.component.scss']
})
export class GamechatComponent implements OnInit {
  @Input() playerColor: string = ''
  otherPlayerColor: string = ''
  username: string
  messageText: String = ''
  messageArray: Array<{ user: String, message: String }> = [];

  constructor(
    private gamesocketService: GamesocketService,
    private userHttpService: UserHttpService) {
    this.username = this.userHttpService.username
  }

  ngOnInit(): void {
    this.receiveMessage()
    if (this.playerColor === 'red')
      this.otherPlayerColor = 'blue'
    else
      this.otherPlayerColor = 'red'
  }

  sendMessage() {
    if (this.messageText.trim().length !== 0 && this.messageText.length <= 150) {
      this.gamesocketService.sendMessage(this.messageText)
      this.messageArray.push({ user: this.username, message: this.messageText })
    }
    this.messageText = ''
  }

  receiveMessage() {
    this.gamesocketService.receiveMessage().subscribe((data: any) => {
      this.messageArray.push({ user: data.player, message: data.message })
      this.messageText = ''
    })
  }
}
