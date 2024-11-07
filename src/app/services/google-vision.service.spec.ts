import { TestBed } from '@angular/core/testing';

import { GoogleVisionService } from './google-vision.service';

describe('GoogleVisionService', () => {
  let service: GoogleVisionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleVisionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
