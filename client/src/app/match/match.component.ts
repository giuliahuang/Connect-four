import { AssertNotNull, tokenName } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Match } from '../../../../api/src/game/gameplay/Match'
import { SocketioService } from '../socketio.service';
import { MatSnackBar } from '@angular/material/snack-bar'
import { Player } from '../../../../api/src/game/gameplay/Player';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})


export class MatchComponent implements OnInit {
  gameId:string|any="";
  colors:string[]=[];
  player = 1;
  heights:number[]=[]
  p1:number = 1;
  p2:number = 2;
  newPlayer:any;
  playerTurn;
  ioConnection:any;

  constructor(
    private socketIoService: SocketioService, 
    private snackbar: MatSnackBar,
    private router:Router
    ){

    //this.match = new Match(this.p1, this.p2);
    this.playerTurn=1;
    this.colors[1] = "yellow";
    this.colors[-1] = "red";
    for(var i=0;i<7;i++){
      this.heights[i]=0;
    }
  }

  ngOnInit(): void {
    this.receivePlayer()
    this.receiveGameUpdateMSG();
    this.receiveGameUpdate();
    this.receiveJoinedPlayers();
  }

/*
  addDot(colclass:string, id:number){

    const colList = document.getElementsByClassName('name');
    const col = colclass.substr(colclass.length-1);
    const cell = document.getElementById(''+this.heights[parseInt(col)]+col);

    if(this.match.addDot(parseInt(col),this.p1)){
      if(cell?.classList.contains('cell')){
        cell.classList.replace('cell',this.colors[this.p1]+'cell') 
        if(this.match.isWinner(parseInt(col))){
          alert("Player: "+this.p1+"has won !!");
        }
      }
      else{
        alert("Col Full")
      }
    }
    else if(this.match.addDot(parseInt(col),this.p2)){
      if(cell?.classList.contains('cell')){
        cell.classList.replace('cell',this.colors[this.p2]+'cell')
        if(this.match.isWinner(parseInt(col))){
          alert("Player: "+this.p2+"has won !!");
        }
      }
      else{
        alert("Col Full")
      }
    }
  }
*/

  receivePlayer(){
    this.socketIoService.receivePlayer().subscribe((player)=>{
      this.newPlayer=player;
    })
  }

  receiveGameUpdateMSG(){
    this.socketIoService.receiveGameUpdateMSG().subscribe((message)=>{
      this.snackbar.open(String(message),'',{
        duration: 3000,
      });
    })
  }

  receiveGameUpdate(){
    this.socketIoService.receiveGameUpdate().subscribe((message:any) => {
      this.snackbar.open(String(message),'',{
        duration: 3000,
      });
      var className = "col" + (message.col)
      console.log(className);
      //TODO player id 换成 player.turn(新的)
      this.receiveChange(className,message.turn)
     });
  }

  setPlayer(){
    this.socketIoService.socket?.on('setPlayer', (player)=>{
      this.newPlayer=player;
      console.log("player set")
    })
  }

  receiveChange(colclass:string,turn:number){

    //if addDot == true allora cambia colore altrimenti no 

    //ottengo tutte tutte le righe di una colonna
    const colList = document.getElementsByClassName('name');

    //ottengo la colonna dal name 
    const col = colclass.substr(colclass.length-1);

    //identifico la cella
    const cell = document.getElementById(''+this.heights[parseInt(col)]+col);

    if(cell?.classList.contains('cell')){
      cell.classList.replace('cell',this.colors[turn]+'cell')
      this.heights[parseInt(col)]++;
      console.log("a disk has been added")
    }

    else{
      alert("Col Full")
    }
  }
  

  change(colclass:string,turn:number){
    //if addDot == true allora cambia colore altrimenti no 

    //ottengo tutte tutte le righe di una colonna
    const colList = document.getElementsByClassName('name');

    //ottengo la colonna dal name 
    const col = colclass.substr(colclass.length-1);

    //identifico la cella
    const cell = document.getElementById(''+this.heights[parseInt(col)]+col);


    if(cell?.classList.contains('cell')){
      cell.classList.replace('cell',this.colors[this.playerTurn]+'cell')
      this.heights[parseInt(col)]++;
      console.log(this.playerTurn)
      this.socketIoService.sendGameUpdate(parseInt(col),this.playerTurn)
      this.playerTurn*=-1;
    }
    else{
      alert("Col Full")
    }

  } 


  //从client socketservice里接收msg并发送webbrowser
  receiveJoinedPlayers(){
     this.socketIoService.receiveJoinedPlayers().subscribe((message) => {
      this.snackbar.open(String(message),'',{
        duration: 3000,
      });
     });
  }


}
