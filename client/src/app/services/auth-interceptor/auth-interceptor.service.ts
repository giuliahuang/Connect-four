import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const idToken = localStorage.getItem('jwt')

    if (idToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', idToken)
      })
      return next.handle(cloned).pipe(
        catchError((err) => {
          if (err && err.status === 401) {
            localStorage.removeItem('jwt')
            this.router.navigate(['/login'])
          } else if (err && err.status === 404) {
            this.router.navigate(['/not-found'])
          }
          return next.handle(req)
        })
      )
    }
    return next.handle(req)
  }
}
