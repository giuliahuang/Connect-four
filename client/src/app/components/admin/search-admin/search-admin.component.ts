import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { UserHttpService } from 'src/app/services/user-http.service'

@Component({
  selector: 'app-search-admin',
  templateUrl: './search-admin.component.html',
  styleUrls: ['./search-admin.component.scss']
})
export class SearchAdminComponent implements OnInit {

   

  constructor(private userHttpService: UserHttpService, private router: Router) { }

  ngOnInit(): void {
  }

  

}
