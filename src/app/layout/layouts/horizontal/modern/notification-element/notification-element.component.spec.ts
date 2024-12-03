import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationElementComponent } from './notification-element.component';

describe('NotificationElementComponent', () => {
  let component: NotificationElementComponent;
  let fixture: ComponentFixture<NotificationElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationElementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
