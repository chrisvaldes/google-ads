import { TestBed } from '@angular/core/testing';

import { FacebookAdService } from './facebook-ad.service';

describe('FacebookAdService', () => {
  let service: FacebookAdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacebookAdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
