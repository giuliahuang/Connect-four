import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import * as jwtdecode from 'jwt-decode'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import Friend from '../interfaces/Friend'

interface TokenData {
  username: string,
  mail: string,
  roles: string[],
  id: string
}

@Injectable()
export class UserHttpService {

  private token = '';
  public url = 'http://localhost:5000';

  constructor(private http: HttpClient) {
    console.log('User service instantiated')
    let temp = localStorage.getItem('postmessages_token')
    this.token = temp !== null ? temp : ""
    if (!this.token || this.token.length < 1) {
      console.log("No token found in local storage")
      this.token = ""
    } else {
      console.log("JWT loaded from local storage.")
    }
  }

  login(user: any): Observable<any> {

    console.log('Login: ' + user.email + ' ' + user.password)
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
        this.token = data.token
        localStorage.setItem('postmessages_token', this.token)
      }))
  }

  logout() {
    console.log('Logging out')
    this.token = ''
    localStorage.setItem('postmessages_token', this.token)
  }

  register(user: any): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      })
    }

    return this.http.post(this.url + '/signup', user, options).pipe(
      tap((data) => {
        console.log(JSON.stringify(data))
      })
    )

  }

  get_token() {
    return this.token
  }

  getUserProfile() {
    return this.http.get(`${this.url}/auth/profile`)
  }

  getOtherUserProfile(username: string) {
    return this.http.get(`${this.url}/auth/profile/user/${username}`)
  }

  get_username() {
    const username = (jwtdecode(this.token) as TokenData).username
    console.log(jwtdecode(this.token))
    return username
  }

  get_mail() {
    return (jwtdecode(this.token) as TokenData).mail
  }

  get_id() {
    return (jwtdecode(this.token) as TokenData).id
  }

  is_admin(): boolean {
    const roles = (jwtdecode(this.token) as TokenData).roles
    for (let idx = 0; idx < roles.length; ++idx) {
      if (roles[idx] === 'ADMIN') {
        return true
      }
    }
    return false
  }

  is_moderator(): boolean {
    const roles = (jwtdecode(this.token) as TokenData).roles
    for (let idx = 0; idx < roles.length; ++idx) {
      if (roles[idx] === 'MODERATOR') {
        return true
      }
    }
    return false
  }

  addFriend(username: string) {
    const data = { 'requestedUsername': username }
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') }
    return this.http.post(`${this.url}/auth/friends`, data, config)
  }

  respondFriendRequest(hasAccepted: boolean, username: string) {
    const data = { 'hasAccepted': hasAccepted, 'askerUsername': username }
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') }
    return this.http.post(`${this.url}/auth/friends/friendrequests`, data, config)
  }

  searchUser(username: string) {
    return this.http.get(`${this.url}/auth/search?username=${username}`)
  }

  getFriends(): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        authorization: (this.token),
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      })
    }
    return this.http.get<Friend[]>(this.url + '/auth/friends', options).pipe(
      tap((data: any) => {
        console.log(JSON.stringify(data))
      }))
  }

  deleteFriend(user: any) {
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') }
    return this.http.delete(`${this.url}/auth/friends/${user}`)
  }

  newPassword(current: string, newPass: string) {
    const data = { 'currentPass': current, 'newPass': newPass }
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') }
    return this.http.post(`${this.url}/auth/profile/newpassword`, data, config)
  }
}
