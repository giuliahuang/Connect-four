import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { UserHttpService } from 'src/app/services/user-http.service'
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core'

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted))
  }
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  matcher = new MyErrorStateMatcher();

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
