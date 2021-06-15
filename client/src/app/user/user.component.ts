import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketioService } from '../socketio.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  id = Math.random()*200;
  mmr = Math.random()*50

  constructor(
    private router:Router,
    private socketIoService:SocketioService
    ) { }

  ngOnInit(): void {
    this.socketIoService.connect();
  }


  startGame(){
    this.socketIoService.startGame(this.id,this.mmr)
    this.socketIoService.connectMatch()
    this.router.navigate(['/match']);
  }

}
