import { AssertNotNull, tokenName } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketioService } from '../socketio.service';
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})


export class MatchComponent implements OnInit {

  colors:string[]=[];
  heights:number[]=[]
  playerTurn;

  constructor(
    private socketIoService: SocketioService, 
    // private snackbar: MatSnackBar,
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
    console.log("Match page")
    this.receiveGameUpdateMSG();
    this.receiveGameUpdate();
    this.receiveEndMatch();
    this.receiveWinnerMessage();
    this.receivePlayerMoveRejection();
    this.receivePlayerDisconnetedMessage()
  }

  receivePlayerDisconnetedMessage(){
    this.socketIoService.receivePlayerMoveRejection().subscribe((message:any)=>{
      //TODO
      console.log(`player ${message.username} has disconnected for ${message.reason}`)
    })
  }

  receivePlayerMoveRejection(){
    this.socketIoService.receivePlayerMoveRejection().subscribe((message:any)=>{
      //TODO
      console.log(`player ${message.username} cannot add dot at column ${message.column}`)
    })
  }


  receiveWinnerMessage(){
    this.socketIoService.receiveWinnerMessage().subscribe((message)=>{
      //TODO: print it on the screen
      console.log(message)
    })
  }

  receiveGameUpdateMSG(){
    this.socketIoService.receiveGameUpdateMSG().subscribe((message)=>{
      // this.snackbar.open(String(message),'',{
      //   duration: 3000,
      // });
      console.log(message)
    })
  }

  //receive game update data
  receiveGameUpdate(){
    console.log('start receiving game update')
    this.socketIoService.receiveGameUpdate().subscribe((col:any) => {
      // this.snackbar.open(String(message),'',{
      //   duration: 3000,
      // });
      console.log(col)
      var className = "col" + (col)
      console.log(className);
      //TODO player id 换成 player.turn(新的)
      this.addDot(className)
     });
  }

  //after clicking on one of the column, an addDotRequest will be sent
  addDotRequest(colclass:string){
    const col = parseInt(colclass.substr(colclass.length-1));
    console.log('add dot request at col ' + col)
    this.socketIoService.addDotRequest(col);
  }

  //end of match
  receiveEndMatch(){
    this.socketIoService.receiveEndMatch().subscribe((username)=>{
      console.log('End Match of ' + username)
      this.router.navigate(['/user'])
      this.socketIoService.gamesocket?.disconnect()
    })
  }

  //add an dot
  private addDot(colclass:string){

    //ottengo tutte tutte le righe di una colonna
    const colList = document.getElementsByClassName('name');

    //ottengo la colonna dal name 
    const col = colclass.substr(colclass.length-1);

    //identifico la cella
    const cell = document.getElementById(''+this.heights[parseInt(col)]+col);

    if(cell?.classList.contains('cell')){
      //TODO: gestire i colori 
      cell.classList.replace('cell',this.colors[this.playerTurn]+'cell')
      this.heights[parseInt(col)]++;
      console.log("a disk has been added")
    }
    else{
      alert("Col Full")
    }
  }
  
  /*

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
      // this.socketIoService.sendGameUpdate(parseInt(col),this.playerTurn)
      this.playerTurn*=-1;
    }
    else{
      alert("Col Full")
    }
  } 
  */


  //从client socketservice里接收msg并发送webbrowser
  receiveJoinedPlayers(){
     this.socketIoService.receiveJoinedPlayers().subscribe((message) => {
      // this.snackbar.open(String(message),'',{
      //   duration: 3000,
      // });
      console.log(message)
     });
  }


}
