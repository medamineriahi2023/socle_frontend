import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeBarScannerComponent } from './code-bar-scanner.component';

describe('CodeBarScannerComponent', () => {
  let component: CodeBarScannerComponent;
  let fixture: ComponentFixture<CodeBarScannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeBarScannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeBarScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
