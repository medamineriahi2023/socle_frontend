import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGlobalTableComponent } from './user-global-table.component';

describe('UserGlobalTableComponent', () => {
  let component: UserGlobalTableComponent;
  let fixture: ComponentFixture<UserGlobalTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserGlobalTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserGlobalTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
