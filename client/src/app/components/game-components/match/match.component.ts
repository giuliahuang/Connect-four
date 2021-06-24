import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { GamesocketService } from 'src/app/services/gamesocket.service'
import { EndgameDialogComponent } from '../endgame-dialog/endgame-dialog.component'

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})


export class MatchComponent implements OnInit {

  cell: any[]=[]
  nextColor!: boolean;
  heights:number[]=[]
  player1={
    username:"",
    color:""
  }
  player2={
    username:"",
    color:""
  }

  constructor(
    private gamesocketService: GamesocketService, 
    private router:Router,
    private dialog:MatDialog,
    ){
  }


  ngOnInit(): void {
    this.newGame()
    this.receiveGameUpdate();
    this.receiveEndMatch();
    this.receiveWinnerMessage();
    this.receivePlayerMoveRejection();
    this.receivePlayerDisconnetedMessage()
    this.receivePlayers()
  }

  //initialization of the game
  newGame(){
    this.heights = Array(7).fill(0)
    this.cell = Array(42).fill(null);
    this.player1.username="";
    this.player2.username="";
    this.player1.color="";
    this.player2.color="";

    if(this.nextColor){
      this.player1.color="yellow"
      this.player2.color="red"
    }
    else{
      this.player2.color="yellow"
      this.player1.color="red"
    }
  }
  
  get color(){
    return this.nextColor ? "yellow" : "red"
  }
  
  //opens a dialog with the winner message and an exit button
  openDialog(message:String){
    let dialogRef = this.dialog.open(EndgameDialogComponent,{data: {message: message}})
  }

  //receives a disconnection message with the user and its reason
  receivePlayerDisconnetedMessage(){
    this.gamesocketService.receivePlayerMoveRejection().subscribe((message:any)=>{
      //TODO
      console.log(`player ${message.username} has disconnected for ${message.reason}`)
    })
  }

  //receive a rejection when it is not the right player move
  receivePlayerMoveRejection(){
    this.gamesocketService.receivePlayerMoveRejection().subscribe((message:any)=>{
      console.log(`player ${message.username} cannot add dot at column ${message.column}`)
    })
  }

  //receives a message when player wins the game
  receiveWinnerMessage(){
    this.gamesocketService.gamesocket?.on('winner',(message)=>{
      this.openDialog(message);
    })
  }

  //updates the gameboard if allowed by the server
  receiveGameUpdate(){
    console.log('start receiving game update')
    this.gamesocketService.receiveGameUpdate().subscribe((col:any) => {
      this.addDot(col)
     });
  }


  //sends a request to the server to add a dot
  addDotRequest(index:number){
    var col=index%7;
    console.log('add dot request at col ' + col)
    this.gamesocketService.addDotRequest(col);
  }

  //end of match
  receiveEndMatch(){
    this.gamesocketService.receiveEndMatch().subscribe((username)=>{
      console.log('End Match of ' + username)
      this.router.navigate(['/user'])
    })
  }

  //adds a dot to the gameboard
  private addDot(col:number){
    if(this.heights[col]<7){
      this.cell.splice(col+(7*(5-this.heights[col])),1,this.color)
      this.heights[col]++
      this.nextColor = !this.nextColor
    }
  }
  
  //receives the order of the player and sets the starting color
  receivePlayers(){
     this.gamesocketService.gamesocket?.on('order', (message)=>{
       console.log("player received")
        this.player1.username = message.player1;
        this.player2.username = message.player2;
        this.nextColor=message.random;
     })
  }


}

