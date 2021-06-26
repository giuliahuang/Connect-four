import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { Event as NavigationEvent, NavigationEnd, Router } from '@angular/router'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
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
