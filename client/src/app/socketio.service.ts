import { Injectable } from '@angular/core';
import { observable, Observable } from 'rxjs';
import { io,Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Player } from '../../../api/src/game/gameplay/Player';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket: Socket | undefined
  gamesocket: Socket | undefined
  

  constructor() { }

  connect(){
    this.socket = io(environment.SOCKET_ENDPOINT)
    this.socket.emit('joinGame','joined on initial websocket ')
  }

  connectMatch(){
    this.socket?.on('matched', (port) => {
      this.gamesocket = io('http://localhost:' + port)
      //this.gamesocket.emit('gameConnection',this.socket);
    })
  }
  

  addDot(turn:string,col:number){
    this.socket?.emit(turn,col);
  }

  startGame(id:any,mmr:any){
    var message = {
      id: id,
      mmr: mmr,
    }
    this.socket!.emit('startGame',{message});
  }

  //接收server说有个玩家加入同一个gameid
  receiveJoinedPlayers(){
    return new Observable((observer)=>{
      this.socket?.on('joinGame', (message) =>{
        observer.next(message);
      });
    });
  }

  sendGameUpdate(col:number, turn:number){
    const message = {
      turn: turn,
      col: col,
    }
    console.log(message.turn);
    //console.log("gameupdate sended")
    console.log(this.gamesocket+'ok')
    this.gamesocket?.emit('gameUpdate',message)

  }

  receiveGameSocket(){
    this.gamesocket?.on('socket',(socketid)=>{
      this.gamesocket!.id=socketid;
      console.log(this.gamesocket)
    })
  }

  receiveGameUpdate(){
    return new Observable((observer)=>{
      this.gamesocket?.on('gameUpdate', (message) =>{
        console.log("received")
        observer.next(message);
      });
    });

  }

  receiveGameUpdateMSG(){
    return new Observable((observer)=>{
      this.socket?.on('gameUpdateMSG', (message) =>{
        observer.next(message);
      });
    });
  }

  //接收server说玩家加了一个点
  receiveChanges(){
    return new Observable((observer)=>{
      this.socket?.on('addDot', (message) =>{
        observer.next(message);
      });
    });
  }
}
