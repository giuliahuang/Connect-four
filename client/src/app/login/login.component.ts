import { Component, OnInit } from '@angular/core';
import { UserHttpService } from '../user-http.service';
import { Router } from '@angular/router';
import { SocketioService } from '../socketio.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public errmessage = undefined;
  public user = { email: '', password: '', remember: '' };
  constructor( 
    private us: UserHttpService, 
    private router: Router ,
    private socketIoService:SocketioService) { }

  ngOnInit() {
  }

  login() {
    this.us.login( this.user ).subscribe( (d) => {
      console.log('Login granted: ' + JSON.stringify(d) );
      console.log('User service token: ' + this.us.get_token() );
      this.errmessage = undefined;
      var token = this.us.get_token()
      this.socketIoService.connect(token.replace("Bearer ",""));
      this.router.navigate(['/user']);
    }, (err) => {
      console.log('Login error: ' + JSON.stringify(err) );
      this.errmessage = err.message;

    });

  }


  loginMatch() {
    this.us.login( this.user ).subscribe( (d) => {
      console.log('Login granted: ' + JSON.stringify(d) );
      console.log('User service token: ' + this.us.get_token() );
      this.errmessage = undefined;
      var token = this.us.get_token()
      this.socketIoService.receiveMatchPort(token.replace("Bearer ",""));
    }, (err) => {
      console.log('Login error: ' + JSON.stringify(err) );
      this.errmessage = err.message;

    });

  }

}