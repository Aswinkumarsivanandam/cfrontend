import { TestBed } from '@angular/core/testing';

import { EsignDocumentService } from './esign-document.service';

describe('EsignDocumentService', () => {
  let service: EsignDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EsignDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
