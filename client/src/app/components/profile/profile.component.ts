import { Component, Input, OnInit } from '@angular/core'
import { tick } from '@angular/core/testing'
import { ActivatedRoute } from '@angular/router'
import { SocketioService } from 'src/app/services/socketio.service'
import { UserHttpService } from 'src/app/services/user-http.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  apiUrl = 'http://localhost:5000'
  sub: any
  us: string = ''

  loggedUsername: string

  profile : any

  user: any
  wins = 0
  losses = 0
  ratio = 1

  friends : string[] = []

  isAdmin : boolean = false
  isMod : boolean = false

  constructor(private userHttpService: UserHttpService, private route: ActivatedRoute, private socketIoService: SocketioService) {
    this.loggedUsername = userHttpService.username
  }


  ngOnInit(): void {
    this.user = this.route.snapshot.data.profile
    this.user.avatar = `${this.apiUrl}/${this.user.avatar}`
    if (this.user.roles.includes('ADMIN')) {
      this.isAdmin = true
    }
    if(this.user.roles.includes('MODERATOR')){
      this.isMod = true
    }
    this.computeStats()
    console.log(this.friends)
  }

  getFriends(){
    this.userHttpService.getFriends().subscribe((res: any)=>{
      res.forEach((element : any) => {
        this.friends.push(element.username)
      });
    })
  }

  computeStats() {
    const matches = this.user.matchesPlayed

    matches.forEach((match: any) => {
      if (match.winner === this.user.username) ++this.wins
      else ++this.losses
    })

    if (this.losses === 0) this.ratio = this.wins
    else this.ratio = this.wins / this.losses
    this.friends = this.user.friends
  }

  addFriend() {
    if (this.loggedUsername !== this.user.username) {
      this.socketIoService.addFriend(this.user.username)
      this.userHttpService.addFriend(this.user.username).subscribe(res => console.log(res))
    }
  }

  acceptFriend(username: string) {
    this.userHttpService.respondFriendRequest(true, username).subscribe(res => {
      this.user.friendRequests = this.user.friendRequests.filter((name: string) => name !== username)
      this.user.friends.push(username)
    })
  }

  refuseFriend(username: string) {
    this.userHttpService.respondFriendRequest(false, username).subscribe(res => this.user.friendRequests = this.user.friendRequests.filter((name: any) => name !== username))
  }

  removeFriend(username: string) {
    this.userHttpService.deleteFriend(username).subscribe(res => this.user.friends = this.user.friends.filter((friend: string) => friend !== username))
    this.user = this.route.snapshot.data.profile
    console.log(this.user.friends)
  }

  removeSelf(){
    this.userHttpService.deleteSelfUser().subscribe()
  }
}
