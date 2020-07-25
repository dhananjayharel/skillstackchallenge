import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentDescriptionComponent } from './environment-description.component';

describe('EnvironmentDescriptionComponent', () => {
  let component: EnvironmentDescriptionComponent;
  let fixture: ComponentFixture<EnvironmentDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvironmentDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
