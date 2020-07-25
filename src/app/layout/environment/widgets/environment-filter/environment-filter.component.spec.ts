import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentFilterComponent } from './environment-filter.component';

describe('EnvironmentFilterComponent', () => {
  let component: EnvironmentFilterComponent;
  let fixture: ComponentFixture<EnvironmentFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvironmentFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
