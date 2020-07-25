import { TestBed, inject } from '@angular/core/testing';

import { SharedenvironmentactionsService } from './sharedenvironmentactions.service';

describe('SharedtestactionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedenvironmentactionsService]
    });
  });

  it('should be created', inject([SharedenvironmentactionsService], (service: SharedenvironmentactionsService) => {
    expect(service).toBeTruthy();
  }));
});
