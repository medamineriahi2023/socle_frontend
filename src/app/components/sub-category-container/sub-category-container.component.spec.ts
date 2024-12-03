import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoryContainerComponent } from './sub-category-container.component';

describe('SubCategoryContainerComponent', () => {
  let component: SubCategoryContainerComponent;
  let fixture: ComponentFixture<SubCategoryContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubCategoryContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubCategoryContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
