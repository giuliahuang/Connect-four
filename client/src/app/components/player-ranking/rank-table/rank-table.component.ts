import { Component, OnInit } from '@angular/core'
import { RankingService } from 'src/app/services/ranking.service'

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


@Component({
  selector: 'app-rank-table',
  templateUrl: './rank-table.component.html',
  styleUrls: ['./rank-table.component.scss']
})
export class RankTableComponent implements OnInit {

  displayedColumns: string[] = ['position', 'username', 'mmr'];
  dataSource:any;
  rankingList:any
  position:number[]=[];
  
  constructor(private rankingService: RankingService) { 
    this.rankingList = this.rankingService.getRanking().subscribe(data =>{
      this.dataSource = data;
      this.dataSource.sort((a:any,b:any) => (a.mmr < b.mmr) ? 1 : ((b.mmr < a.mmr) ? -1 : 0))
    })
  }

  ngOnInit(): void {
  }

}
