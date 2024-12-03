import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDileveryComponent } from './select-dilevery.component';

describe('SelectDileveryComponent', () => {
  let component: SelectDileveryComponent;
  let fixture: ComponentFixture<SelectDileveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectDileveryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectDileveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
