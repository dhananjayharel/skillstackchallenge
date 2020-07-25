import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatetestComponent } from './candidatetest.component';

describe('CandidatetestComponent', () => {
  let component: CandidatetestComponent;
  let fixture: ComponentFixture<CandidatetestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidatetestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatetestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
