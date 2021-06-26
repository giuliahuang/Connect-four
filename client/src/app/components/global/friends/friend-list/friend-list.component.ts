import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, NavigationEnd, Router, Event as NavigationEvent } from '@angular/router'
import Friend from 'src/app/interfaces/Friend'
import { SocketioService } from 'src/app/services/socketio.service'
import { NotificationsService } from 'angular2-notifications'
import { MatDialog } from '@angular/material/dialog'
import { LobbyDialogComponent } from 'src/app/components/game/lobby-dialog/lobby-dialog.component'

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.scss']
})
export class FriendListComponent implements OnInit {
  user: any
  hasAccepted: boolean = false
  inviterUsername: string = ""
  onlineFriends: Friend[] = []
  showChat: boolean = false
  chatMate: string = ''

  url = '/home'
  event$: any

  constructor(
    private socketioService: SocketioService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationsService,
    private dialog: MatDialog
  ) {
    this.event$ = this.router.events.subscribe(
      (event: NavigationEvent) => {
        if (event instanceof NavigationEnd) {
          this.url = event.url
        }
      }
    )
  }

  ngOnInit(): void {
    this.user = this.route.snapshot.data.profile
    this.socketioService.getOnlineFriend().subscribe(username => {
      if (!this.isOnline(username)) this.onlineFriends.push({ username, port: undefined })
    })
    this.socketioService.getFriendDisconnected().subscribe(username => {
      this.hasGoneOffline(username)
    })
    this.receiveStartedPlaying()
    this.receiveStoppedPlaying()
    this.reiceveFriendReqNot()
  }

  sendInviteResponse() {
    this.socketioService.sendInviteResponse(this.hasAccepted, this.inviterUsername)
  }


  receiveInviteResponse() {
    this.socketioService.socket?.on('inviteResponse', (message) => {
      this.hasAccepted = message
    })
  }

  //receives the data of the player who finished the play and deletes it from the list
  receiveStoppedPlaying() {
    this.socketioService.receiveStoppedPlaying().subscribe((message: any) => {
      this.stoppedPlaying(message)
    })
  }

  //receives the data of the player who started the play and adds it to the list
  receiveStartedPlaying() {
    this.socketioService.receiveStartedPlaying().subscribe((message: any) => {
      this.startedPlaying(message)
    })
  }

  isOnline(checkFriend: string) {
    for (let i = 0; i < this.onlineFriends.length; ++i) {
      if (this.onlineFriends[i].username === checkFriend)
        return true
    }
    return false
  }

  startedPlaying(playingFriend: Friend) {
    for (let i = 0; i < this.onlineFriends.length; ++i) {
      if (this.onlineFriends[i].username === playingFriend.username) {
        this.onlineFriends[i].port = playingFriend.port
        return
      }
    }
  }

  stoppedPlaying(stoppedPlayingFriend: string) {
    for (const friend of this.onlineFriends) {
      if (friend.username === stoppedPlayingFriend) {
        friend.port = undefined
        return
      }
    }
  }

  hasGoneOffline(friend: string) {
    for (let i = 0; i < this.onlineFriends.length; ++i) {
      if (friend === this.onlineFriends[i].username) {
        this.onlineFriends = this.onlineFriends.splice(i, 1)
        return
      }
    }
  }

  chatEvent(username: any) {
    if (username === this.chatMate) {
      this.showChat = false
      this.chatMate = ''
    } else {
      this.chatMate = username
      this.showChat = true
    }
  }

  openDialog() {
    this.dialog.open(LobbyDialogComponent, { disableClose: true })
  }

  onFriendRequest(username: string) {
    this.notificationService.info('Request', "You receive a friend requesto from " + username, {
      position: ['bottom', 'right'],
      timeOut: 8000,
      animate: 'fade',
      showProgressBar: true,
    })
  }

  reiceveFriendReqNot() {
    this.socketioService.receiveFriendRequest().subscribe((message) => {
      console.log("Friend request from : " + message)
      this.onFriendRequest(message as string)
    })
  }
}
