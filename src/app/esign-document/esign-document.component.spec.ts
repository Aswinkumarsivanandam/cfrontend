import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsignDocumentComponent } from './esign-document.component';

describe('EsignDocumentComponent', () => {
  let component: EsignDocumentComponent;
  let fixture: ComponentFixture<EsignDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsignDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsignDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
