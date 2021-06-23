import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendtmpComponent } from './friendtmp.component';

describe('FriendtmpComponent', () => {
  let component: FriendtmpComponent;
  let fixture: ComponentFixture<FriendtmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendtmpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendtmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
