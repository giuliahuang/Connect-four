import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketioService } from '../socketio.service';
import { UserHttpService } from '../user-http.service';
import * as jwtdecode from 'jwt-decode';


interface TokenData {
  username:string,
  mail:string,
  roles:string[],
  id:string
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})


export class UserComponent implements OnInit {

  constructor(
    private router:Router,
    private socketIoService:SocketioService,
    private us:UserHttpService
    ) { }

  ngOnInit(): void {
  }
  

  //an user can invite another user (in his friends' list)
  invite(){

  }

  //an user can watch a match of other users
  observe(){

  }


  startGame(){
    this.socketIoService.startGame()
    //call a function that waits for match and then navigate to /match
    console.log(jwtdecode(this.us.get_token())as TokenData)
    this.socketIoService.receiveMatchPort(this.us.get_token().replace("Bearer ",""))
  }

}
