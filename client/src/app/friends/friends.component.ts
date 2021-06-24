import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Friend } from '../friend';
import { UserHttpService } from '../user-http.service';
import { SocketioService } from '../socketio.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {
  public friends: Friend[] = [];

  constructor(
    private httpClient: HttpClient,
    private us: UserHttpService,
    private sio: SocketioService
  ) { }

  ngOnInit(): void {
    this.getFriends();
  }

  public getFriends(){
    this.us.getFriends().subscribe(
      (friends) => {
        this.friends = friends;
      }
    )
  }

  public deleteFriend(email : string){
    for(var i = 0; i < this.friends.length; i++){
      if(this.friends[i]["email"] == email){
        let friend = this.friends[i]["email"]
        this.us.deleteFriend(friend).subscribe(
          () => {
            console.log("Friend deleted")
            this.getFriends();
          }
        )
      }
    }
  }

}
