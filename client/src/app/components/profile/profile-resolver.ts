import { Injectable } from "@angular/core"
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router"
import { Observable } from "rxjs"
import { UserHttpService } from "src/app/services/user-http.service"

@Injectable({ providedIn: 'root' })
export class ProfileResolver implements Resolve<any> {

  constructor(private userHttpService: UserHttpService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    const param = route.paramMap.get('username')
    if (param && param.length > 0)
      return this.userHttpService.getOtherUserProfile(route.paramMap.get('username'))
    else
      return this.userHttpService.getUserProfile()
  }
}