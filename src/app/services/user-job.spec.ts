import { TestBed } from '@angular/core/testing';

import { UserJob } from './user-job';

describe('UserJob', () => {
  let service: UserJob;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserJob);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
