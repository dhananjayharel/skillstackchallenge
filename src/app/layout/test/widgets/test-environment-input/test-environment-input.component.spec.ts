import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestEnvironmentInputComponent } from './test-environment-input.component';

describe('TestEnvironmentInputComponent', () => {
  let component: TestEnvironmentInputComponent;
  let fixture: ComponentFixture<TestEnvironmentInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestEnvironmentInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestEnvironmentInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
