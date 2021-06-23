import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyDialogComponent } from './lobby-dialog.component';

describe('LobbyDialogComponent', () => {
  let component: LobbyDialogComponent;
  let fixture: ComponentFixture<LobbyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LobbyDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
