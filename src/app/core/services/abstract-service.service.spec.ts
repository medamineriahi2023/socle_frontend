import { TestBed } from '@angular/core/testing';

import { AbstractServiceService } from './abstract-service.service';

describe('AbstractServiceService', () => {
  let service: AbstractServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbstractServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
