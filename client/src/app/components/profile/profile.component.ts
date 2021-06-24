import { Component, OnInit, Input } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { UserHttpService } from 'src/app/services/user-http.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Input() username: string | null = this.route.snapshot.paramMap.get('username')

  loggedUser: any
  user: any
  avatar: any
  wins = 0
  losses = 0
  ratio = 1
  friends: string[] = []
  friendRequests: string[] = []

  constructor(private userHttpService: UserHttpService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (!this.username) {
      this.userHttpService.getUserProfile().subscribe(profile => {
        this.loggedUser = profile
        this.user = profile
        this.avatar = `http://localhost:5000/${this.user.avatar}`
        this.friends = this.user.friends
        this.friendRequests = this.user.receivedFriendReqs
        this.computeStats()
      })
    } else {
      this.userHttpService.getUserProfile().subscribe(profile => {
        this.loggedUser = profile
      })

      this.userHttpService.getOtherUserProfile(this.username).subscribe(profile => {
        this.user = profile
        this.avatar = `http://localhost:5000/${this.user.avatar}`
        this.computeStats()
      })
    }
  }

  computeStats() {
    const matches = this.user.matchesPlayed

    matches.forEach((match: any) => {
      if (match.winner === this.user.username) ++this.wins
      else ++this.losses
    })

    if (this.losses === 0) this.ratio = this.wins
    else this.ratio = this.wins / this.losses
  }

  addFriend() {
    if (this.loggedUser.username !== this.user.username) {
      this.userHttpService.addFriend(this.user.username).subscribe(res => console.log(res))
    }
  }

  acceptFriend(username: string) {
    this.userHttpService.respondFriendRequest(true, username).subscribe(res => {
      this.friendRequests = this.friendRequests.filter(name => name !== username)
      this.friends.push(username)
    })
  }

  refuseFriend(username: string) {
    this.userHttpService.respondFriendRequest(false, username).subscribe(res => this.friendRequests = this.friendRequests.filter(name => name !== username))
  }

  removeFriend(username: string) {
    this.userHttpService.deleteFriend(username).subscribe(res => this.friends = this.friends.filter(friend => friend !== username))
  }
}
