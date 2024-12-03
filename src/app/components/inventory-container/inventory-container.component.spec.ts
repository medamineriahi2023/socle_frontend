import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryContainerComponent } from './inventory-container.component';

describe('InventoryContainerComponent', () => {
  let component: InventoryContainerComponent;
  let fixture: ComponentFixture<InventoryContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
