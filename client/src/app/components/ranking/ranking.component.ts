import { Component, OnInit } from '@angular/core';
import { RankingService } from 'src/app/services/ranking.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {

  constructor(
    private rankingService: RankingService
  ) { }

  rankingsList:any

  ngOnInit(): void {
    this.rankingsList = this.rankingService.getRanking().subscribe(data =>{
      this.rankingsList = data;
    })
  }

}
