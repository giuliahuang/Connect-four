import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { UserHttpService } from 'src/app/services/user-http.service'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(private userHttpService: UserHttpService, private router: Router) { }

  ngOnInit(): void {
  }

  search(username: string) {
    this.userHttpService.searchUser(username).subscribe((res: any) => {
      if (res.username) {
        this.router.navigate([`/profile/${username}`])
      }
    })
  }

}
