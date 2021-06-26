import { Component, OnInit } from '@angular/core'
import { NavigationStart, Router, Event as NavigationEvent, NavigationEnd } from '@angular/router'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  selectedItem = '/home'
  event$: any

  constructor(private router: Router) {
    this.event$ = this.router.events.subscribe(
      (event: NavigationEvent) => {
        if (event instanceof NavigationEnd) {
          this.selectedItem = event.url
        }
      }
    )
  }

  ngOnInit(): void { }
}
