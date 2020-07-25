import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollchallengeComponent } from './enrollchallenge.component';

describe('EnrollchallengeComponent', () => {
  let component: EnrollchallengeComponent;
  let fixture: ComponentFixture<EnrollchallengeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollchallengeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollchallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
