import { TestBed } from '@angular/core/testing';

import { StorageServiceService } from './storage-service.service';

describe('StorageServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [StorageServiceService]
  }));

  it('should be created', () => {
    const service: StorageServiceService = TestBed.get(StorageServiceService);
    expect(service).toBeTruthy();
  });
});
