import { HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { JwtHelperService } from '@auth0/angular-jwt'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'

const jwtHelper = new JwtHelperService()

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private url: string = 'http://localhost:5000'

  constructor(private http: HttpClient, private router: Router) { }

  public getToken(): string | null {
    return localStorage.getItem('jwt')
  }

  public login(user: any): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        authorization: 'Basic ' + btoa(user.email + ':' + user.password),
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      })
    }

    return this.http.post(this.url + '/login', user, options).pipe(
      tap((data: any) => {
        console.log(JSON.stringify(data))
        localStorage.setItem('jwt', data.token)
      }))
  }

  logout() {
    localStorage.clear()
    this.router.navigate(['login'])
  }

  public isAuthenticated(): boolean {
    const token = this.getToken()
    if (token)
      return !jwtHelper.isTokenExpired(token)
    else
      return false
  }
}
