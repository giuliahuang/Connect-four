import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SudoService {
    
    public url = 'http://localhost:5000/sudo'

    constructor(private httpClient: HttpClient){ }

    getMods(): Observable<any>{
        return this.httpClient.get(this.url+'/mods')
    }

    createMod(user: any): Observable<any>{
        return this.httpClient.put<any>(this.url+"/mods", user)
    }

    deleteMod(user: any): Observable<any>{
        return this.httpClient.delete<any>(this.url+'/users/${user}')
    }

}