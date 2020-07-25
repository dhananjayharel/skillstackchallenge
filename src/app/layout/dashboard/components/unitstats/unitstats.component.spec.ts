import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitstatsComponent } from './unitstats.component';

describe('UnitstatsComponent', () => {
  let component: UnitstatsComponent;
  let fixture: ComponentFixture<UnitstatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitstatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitstatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
