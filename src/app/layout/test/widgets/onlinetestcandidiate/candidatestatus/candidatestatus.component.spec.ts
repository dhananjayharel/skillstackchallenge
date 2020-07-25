import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatestatusComponent } from './candidatestatus.component';

describe('CandidatestatusComponent', () => {
  let component: CandidatestatusComponent;
  let fixture: ComponentFixture<CandidatestatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidatestatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatestatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
