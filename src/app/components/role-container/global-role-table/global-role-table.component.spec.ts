import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalRoleTableComponent } from './global-role-table.component';

describe('GlobalRoleTableComponent', () => {
  let component: GlobalRoleTableComponent;
  let fixture: ComponentFixture<GlobalRoleTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalRoleTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalRoleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
