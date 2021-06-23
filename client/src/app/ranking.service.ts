import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RankingService {

  constructor(private httpClient: HttpClient) { }

  getRanking(){
    return this.httpClient.get('http://localhost:5000/ranking')
  }
}
