import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModNewPasswordComponent } from './mod-new-password.component';

describe('ModNewPasswordComponent', () => {
  let component: ModNewPasswordComponent;
  let fixture: ComponentFixture<ModNewPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModNewPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModNewPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
