import { Component, OnInit } from '@angular/core'
import { GamesocketService } from '../gamesocket.service'
import { UserHttpService } from '../user-http.service'

@Component({
  selector: 'app-gamechat',
  templateUrl: './gamechat.component.html',
  styleUrls: ['./gamechat.component.scss']
})
export class GamechatComponent implements OnInit {
  user: any
  messageText!: String
  messageArray: Array<{ user: String, message: String }> = [];

  constructor(
    private gamesocketService: GamesocketService,
    private userHttpService: UserHttpService
  ) {
  }

  ngOnInit(): void {
    this.receiveMessage()
    this.userHttpService.getUserProfile().subscribe(user => {
      this.user = user
    })
  }

  sendMessage() {
    console.log(this.user.username)
    if (this.messageText.trim().length !== 0) {
      this.gamesocketService.sendMessage(this.messageText)
      this.messageArray.push({ user: this.user.username, message: this.messageText })
      this.messageText = ''
    }
  }

  receiveMessage() {
    this.gamesocketService.receiveMessage().subscribe((data: any) => {
      this.messageArray.push(data)
      this.messageText = ''
    })
  }
}
