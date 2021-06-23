import { tokenName } from '@angular/compiler';
import { Token } from '@angular/compiler/src/ml_parser/lexer';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { observable, Observable } from 'rxjs';
import { io,Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { GamesocketService } from './gamesocket.service';
import { LobbyDialogComponent } from './lobby-dialog/lobby-dialog.component';
import { UserHttpService } from './user-http.service';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket: Socket | undefined
  gamesocket: Socket | undefined
  

  constructor(
    private router:Router, 
    private us:UserHttpService,
    private gs:GamesocketService,
    ) {
  }

  connect(token:any){
    this.socket = io(environment.SOCKET_ENDPOINT, {
    extraHeaders: {
      'x-auth-token': token
    },
    transportOptions: {
      polling: {
        extraHeaders: {
          'x-auth-token': token
        }
      }
    },
    })
    this.socket.on('ok',message => {
      console.log(message)
    })
    this.socket.emit('joinGame','joined on initial websocket')
    
  }

  receiveMatchPort(token:any){
    console.log('waiting for port')
    this.socket?.on('matched',(port)=>{
      this.gs.connectMatch(
        io('http://localhost:' + port, {
        'forceNew':true,
        extraHeaders: {
          'x-auth-token': token
        },
        transportOptions: {
          polling: {
            extraHeaders: {
              'x-auth-token': token
            }
          }
        },
      }))
    })
  }
  
  startGame(){
    this.socket!.emit('startGame',"someone is starting the game");
    this.socket!.emit('play');
  }
  
  cancelPlay(){
    console.log("calcel play request")
    this.socket?.emit('cancelPlay');
  }

}
