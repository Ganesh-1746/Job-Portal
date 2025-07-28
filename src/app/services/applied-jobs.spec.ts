import { TestBed } from '@angular/core/testing';

import { AppliedJobs } from './applied-jobs';

describe('AppliedJobs', () => {
  let service: AppliedJobs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppliedJobs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
