import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { Observable, Subscription } from 'rxjs'

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit, OnDestroy {
  @Input() hoverColor: string = ''
  @Input() events!: Observable<any>
  @Input() index!: number
  private eventsSubscription!: Subscription
  color: string = ''

  constructor() {
  }

  ngOnInit(): void {
    this.eventsSubscription = this.events.subscribe((message: any) => {
      if (message.index === this.index) {
        this.color = message.color
      }
    })
  }

  get _hoverColor() {
    if (this.color.length === 0) {
      if (this.hoverColor === 'red') {
        return 'redcell'
      } else if (this.hoverColor === 'blue') {
        return 'bluecell'
      }
    }
    return ''
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe()
  }
}
