import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {

  colors:string[]=[];
  player = -1;
  heights:number[]=[]
  constructor(){
    this.colors[1] = "yellow";
    this.colors[-1] = "red";
    for(var i=0;i<7;i++){
      this.heights[i]=0;
    }
  }

  

  change(colclass:string,id:number){
    //if addDot == true allora cambia colore altrimenti no 

    //ottengo tutte tutte le righe di una colonna
    const colList = document.getElementsByClassName('name');

    //ottengo la colonna dal name 
    const col = colclass.substr(colclass.length-1);

    //identifico la cella
    const cell = document.getElementById(''+this.heights[parseInt(col)]+col);


    if(cell?.classList.contains('cell')){
      cell.classList.replace('cell',this.colors[this.player]+'cell')
      this.heights[parseInt(col)]++;
      this.player*=-1;
    }
    else{
      alert("Col Full")
    }

  }

  ngOnInit(): void {
  }

}
