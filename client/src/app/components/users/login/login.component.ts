import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthenticationService } from 'src/app/services/auth/authentication.service'
import { SocketioService } from 'src/app/services/socketio.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public errmessage = undefined;
  public user = { email: '', password: '', remember: '' };
  constructor( 
    private auth: AuthenticationService, 
    private router: Router ,
    private socketIoService:SocketioService) { }

  ngOnInit() {
  }

  login() {
    this.auth.login( this.user ).subscribe( () => {
      this.errmessage = undefined;
      const token = this.auth.getToken()
      if (token)
        this.socketIoService.connect(token.replace("Bearer ",""));
      this.router.navigate(['/']);
    }, (err) => {
      console.log('Login error: ' + JSON.stringify(err) );
      this.errmessage = err.message;
    });
  }
}