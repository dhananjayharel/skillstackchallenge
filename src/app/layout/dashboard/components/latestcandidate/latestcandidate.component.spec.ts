import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestcandidateComponent } from './latestcandidate.component';

describe('LatestcandidateComponent', () => {
  let component: LatestcandidateComponent;
  let fixture: ComponentFixture<LatestcandidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatestcandidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestcandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
