import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RankTableComponent } from '../../player-ranking/rank-table/rank-table.component'

describe('RankTableComponent', () => {
  let component: RankTableComponent
  let fixture: ComponentFixture<RankTableComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RankTableComponent]
    })
      .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(RankTableComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
