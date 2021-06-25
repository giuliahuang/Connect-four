import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'socket.io-client';
import { UserHttpService } from './user-http.service';
import { observable, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GamesocketService {

  gamesocket: Socket | undefined

  constructor(
    private router:Router, 
    private us:UserHttpService
    ) { }

    connectMatch(socket:Socket){
      this.gamesocket=socket;
      this.router.navigate(['/match'])
    }

    connectObserverMatch(socket:Socket){
      this.gamesocket=socket;
      this.router.navigate(['/match'])
    }

    addDotRequest(col:number){
      console.log('add dot request emitted')
      this.gamesocket?.emit('insertDisc',col);
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
    
  sendMessage(message:String){
    this.gamesocket?.emit('message',message)
    console.log("message emitted")
  }

  receiveMessage(){
    return new Observable((observer)=>{
      this.gamesocket?.on('message', (message)=>{
        observer.next(message)
      })
    })
  }
  
  receiveJoinedPlayers(){
    return new Observable((observer)=>{
      this.gamesocket?.on('joinGame', (message) =>{
        observer.next(message);
      });
    });
  }
 
}
