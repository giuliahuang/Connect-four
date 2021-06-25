import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const idToken = localStorage.getItem('postmessages_token')

    if (idToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', idToken)
      })
      return next.handle(cloned).pipe(
        catchError(this.handleError)
      )
    } else {
      return next.handle(req).pipe(
        catchError(this.handleError)
      )
    }
  }

  handleError(error: HttpErrorResponse) {
    console.log(error)
    if (error.status === 401) {
      this.router.navigate(['/'])
    }
    return throwError(error)
  }
}
