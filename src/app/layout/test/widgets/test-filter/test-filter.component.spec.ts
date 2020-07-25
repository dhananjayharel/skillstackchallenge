import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestFilterComponent } from './test-filter.component';

describe('TestFilterComponent', () => {
  let component: TestFilterComponent;
  let fixture: ComponentFixture<TestFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
