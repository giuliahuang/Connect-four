import { Component, OnInit } from '@angular/core';
import { UserHttpService } from '../user-http.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public errmessage = undefined;
  public user = { email: '', password: '', remember: '' };
  constructor( private us: UserHttpService, private router: Router  ) { }

  ngOnInit() {
  }

  login() {
    this.us.login( this.user ).subscribe( (d) => {
      console.log('Login granted: ' + JSON.stringify(d) );
      console.log('User service token: ' + this.us.get_token() );
      this.errmessage = undefined;
      this.router.navigate(['/homepage']);
    }, (err) => {
      console.log('Login error: ' + JSON.stringify(err) );
      this.errmessage = err.message;

    });

  }

}
