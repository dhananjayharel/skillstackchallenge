import { TestBed, inject } from '@angular/core/testing';

import { SharedtestactionsService } from './sharedtestactions.service';

describe('SharedtestactionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedtestactionsService]
    });
  });

  it('should be created', inject([SharedtestactionsService], (service: SharedtestactionsService) => {
    expect(service).toBeTruthy();
  }));
});
