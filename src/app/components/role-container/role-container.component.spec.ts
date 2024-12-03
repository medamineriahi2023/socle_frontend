import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleContainerComponent } from './role-container.component';

describe('RoleContainerComponent', () => {
  let component: RoleContainerComponent;
  let fixture: ComponentFixture<RoleContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
