import { ObserversModule } from '@angular/cdk/observers';
import { tokenName } from '@angular/compiler';
import { Token } from '@angular/compiler/src/ml_parser/lexer';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { observable, Observable } from 'rxjs';
import { io,Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { UserHttpService } from './user-http.service';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket: Socket | undefined
  gamesocket: Socket | undefined
  

  constructor(private router:Router, private us:UserHttpService) {
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
      console.log('token: ' + token)
      this.gamesocket = io('http://localhost:' + port, {
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
      })
      this.router.navigate(['/match'])
      console.log('connected to port'+ port)
    })
  }

  addDotRequest(col:number){
    console.log('add dot request emitted')
    this.gamesocket?.emit('dot',col);
  }

  receiveWinnerMessage(){
    this.gamesocket?.on('winner',message=>{
      console.log("Winner message: "+ message)
      setTimeout(()=>this.router.navigate(['/user']),1000)
    })
  }

  receivePlayerMoveRejection(){
    return new Observable((observer)=>{
      this.gamesocket?.on('playerMoveRejection',(message)=>{
        observer.next(message);
      })
    })
  }

  //receive from the server the acceptance to add a dot
  receiveGameUpdate(){
    return new Observable((observer)=>{
      this.gamesocket?.on('dot', (message) =>{
        console.log("received add dot")
        observer.next(message);
      });
    });

  }

  receivePlayerDisconnetedMessage(){
    return new Observable((observer)=>{
      this.gamesocket?.on('playerDisconnected',message=>{
        observer.unsubscribe();
      })
    })
  }

  receiveEndMatch(){
    return new Observable((observer)=>{
      this.gamesocket?.on('stoppedPlaying', (message) =>{
        console.log("stoppedPlaying")
        observer.unsubscribe();
      });
    });
  }

  startGame(){
    this.socket!.emit('startGame',"someone is starting the game");
    this.socket!.emit('play');
  }

  //接收server说有个玩家加入同一个gameid
  receiveJoinedPlayers(){
    return new Observable((observer)=>{
      this.socket?.on('joinGame', (message) =>{
        observer.next(message);
      });
    });
  }
  

  receivePlayer(){
    return new Observable((observer)=>{
      this.socket?.on('player', (message)=>{
        console.log("player received")
        observer.unsubscribe()
      })
    })
  }

  receiveGameUpdateMSG(){
    return new Observable((observer)=>{
      this.socket?.on('gameUpdateMSG', (message) =>{
        observer.next(message);
      });
    });
  }

  //receive add dots message
  receiveChanges(){
    return new Observable((observer)=>{
      this.socket?.on('addDot', (message) =>{
        observer.next(message);
      });
    });
  }

  sendMessage(message:String){
    this.gamesocket?.emit('message',message)
    console.log("message emitted")
  }

  receiveMessage(){
    return new Observable((observer)=>{
      this.gamesocket?.on('message', (message)=>{
        console.log("收到信息")
        observer.next(message)
      })
    })
  }
 
}
