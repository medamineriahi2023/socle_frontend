import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellModeComponent } from './sell-mode.component';

describe('SellModeComponent', () => {
  let component: SellModeComponent;
  let fixture: ComponentFixture<SellModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellModeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
