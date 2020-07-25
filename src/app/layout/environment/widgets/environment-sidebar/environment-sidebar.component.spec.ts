import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentSidebarComponent } from './environment-sidebar.component';

describe('EnvironmentSidebarComponent', () => {
  let component: EnvironmentSidebarComponent;
  let fixture: ComponentFixture<EnvironmentSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvironmentSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
