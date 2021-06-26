import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SudoService {
    
    public url = 'http://localhost:5000/auth/sudo'

    constructor(private httpClient: HttpClient){ }

    getMods(): Observable<any>{
        return this.httpClient.get(this.url+'/mods')
    }

    createMod(username: string, email: string ,password: string): Observable<any>{
        const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') }
        const data = {'username': username, 'email': email, 'password': password}
        return this.httpClient.put<any>(this.url+"/mods", data, config)
    }

    deleteMod(username: string){
        const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') }
        console.log("USERNAME: "+username)
        return this.httpClient.delete(this.url+"/users/"+username)
    }

    changePasswordMod(email: string, tempPass: string, newPass: string) {
        const data = { 'email': email, 'password': tempPass, 'newPassword': newPass }
        const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') }
        return this.httpClient.post(`http://localhost:5000/login/first`, data, config)
    }

}